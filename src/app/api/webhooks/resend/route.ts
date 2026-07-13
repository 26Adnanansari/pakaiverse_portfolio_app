import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads, replies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Webhook } from "svix";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);

    // Detect event type early so we can apply correct verification
    let type = payload.type;
    let data = payload.data;

    // Resend inbound webhook sends the email directly without a `type` wrapper
    if (!type && payload.from && payload.subject !== undefined) {
      type = "email.received";
      data = payload;
    }

    // ---------------------------------------------------------
    // SIGNATURE VERIFICATION
    // Resend's delivery/bounce webhooks use Svix (whsec_ format).
    // Resend's inbound email.received events do NOT use Svix —
    // they hit the endpoint directly without Svix headers.
    // So: only verify with Svix for non-inbound events.
    // ---------------------------------------------------------
    const isInbound = type === "email.received";

    if (!isInbound) {
      const secret = process.env.WEBHOOK_SECRET;
      if (secret) {
        const svix_id = req.headers.get("svix-id");
        const svix_timestamp = req.headers.get("svix-timestamp");
        const svix_signature = req.headers.get("svix-signature");

        if (!svix_id || !svix_timestamp || !svix_signature) {
          console.warn("[Webhook] Missing svix headers for delivery event");
          return new NextResponse("Missing svix headers", { status: 400 });
        }

        try {
          const wh = new Webhook(secret.startsWith("whsec_") ? secret : `whsec_${secret}`);
          wh.verify(rawBody, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
          });
        } catch {
          console.warn("[Webhook] Svix verification failed");
          return new NextResponse("Webhook verification failed", { status: 400 });
        }
      }
    }

    if (!type || !data) {
      return new NextResponse("Invalid payload shape", { status: 400 });
    }

    console.log(`[Webhook] Received event: ${type}`);

    // ---------------------------------------------------------
    // BRANCH 1: Bounce & Complaints (Delivery events)
    // ---------------------------------------------------------
    if (type === "email.bounced" || type === "email.complained") {
      const email = data.to && data.to[0] ? data.to[0] : "";
      console.log(`[Webhook] ${type} for email: ${email}`);

      if (email) {
        const existingLead = await db.select().from(leads).where(eq(leads.email, email)).limit(1);
        if (existingLead.length > 0) {
          await db.update(leads)
            .set({ suppressList: true, status: "rejected" })
            .where(eq(leads.id, existingLead[0].id));
          console.log(`[Webhook] Suppressed lead id=${existingLead[0].id} due to ${type}`);
        }
      }
    }
    // ---------------------------------------------------------
    // BRANCH 2: Inbound Replies (email.received — no Svix)
    // Resend inbound payload structure:
    // { type: "email.received", data: { from: "Name <email>", to: [...], subject: "...", text: "...", html: "..." } }
    // ---------------------------------------------------------
    else if (type === "email.received") {
      // `from` may be "John Doe <john@example.com>" or just "john@example.com"
      const fromRaw = data.from || "";
      const match = fromRaw.match(/<([^>]+)>/);
      const cleanEmail = (match ? match[1] : fromRaw).trim().toLowerCase();
      const textContent = data.text || data.html || "";
      const subject = data.subject || "";

      console.log(`[Webhook] email.received from: ${cleanEmail}, subject: "${subject}"`);

      if (!cleanEmail) {
        console.warn("[Webhook] email.received: could not extract sender email, skipping");
        return NextResponse.json({ success: true, note: "No sender email" });
      }

      // Find the lead by email
      const existingLead = await db.select().from(leads).where(eq(leads.email, cleanEmail)).limit(1);

      if (existingLead.length === 0) {
        console.warn(`[Webhook] email.received: no lead found for email=${cleanEmail}`);
        // Still return 200 so Resend doesn't retry — just not a lead we track
        return NextResponse.json({ success: true, note: "Lead not found" });
      }

      const lead = existingLead[0];

      // Sentiment classification
      let sentiment = "neutral";
      const lowerText = (textContent + " " + subject).toLowerCase();

      if (
        lowerText.includes("interested") ||
        lowerText.includes("yes") ||
        lowerText.includes("call") ||
        lowerText.includes("meeting") ||
        lowerText.includes("price") ||
        lowerText.includes("cost") ||
        lowerText.includes("quote") ||
        lowerText.includes("want")
      ) {
        sentiment = "interested";
      }
      if (
        lowerText.includes("unsubscribe") ||
        lowerText.includes("stop") ||
        lowerText.includes("not interested") ||
        lowerText.includes("remove me") ||
        lowerText.includes("no thanks")
      ) {
        sentiment = "not_interested";
      }

      const aiSuggestedResponse =
        sentiment === "interested"
          ? `Hi ${lead.name || "there"},\n\nThank you for getting back to me! I would love to learn more about your needs.\n\nWould you be available for a quick 10-minute call this week? Please let me know a time that works for you.\n\nBest regards,\nAdnan Ansari\nPakAiVerse`
          : null;

      await db.insert(replies).values({
        leadId: lead.id,
        messageId: data.messageId || data.id || `inbound-${Date.now()}`,
        content: textContent.slice(0, 5000), // Safety limit
        sentiment,
        aiSuggestedResponse,
        status: "pending",
      });

      console.log(`[Webhook] Saved reply for lead id=${lead.id}, sentiment=${sentiment}`);

      // Update lead status
      if (sentiment === "not_interested") {
        await db.update(leads)
          .set({ suppressList: true, status: "rejected" })
          .where(eq(leads.id, lead.id));
      } else {
        await db.update(leads)
          .set({ status: "contacted" })
          .where(eq(leads.id, lead.id));
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("[Webhook] Error:", errorMessage);
    // Return 200 to prevent Resend from retrying for app errors
    // (retrying won't fix a code bug, just creates duplicate records)
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
