import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads, replies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Webhook } from "svix";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);

    const secret = process.env.WEBHOOK_SECRET;
    const inboundSecret = process.env.RESEND_INBOUND_SECRET;
    
    if (secret || inboundSecret) {
      const svix_id = req.headers.get("svix-id");
      const svix_timestamp = req.headers.get("svix-timestamp");
      const svix_signature = req.headers.get("svix-signature");

      if (!svix_id || !svix_timestamp || !svix_signature) {
        return new NextResponse("Error occured -- no svix headers", { status: 400 });
      }

      const headers = {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      };

      let verified = false;

      // Try Option A (Primary Secret)
      if (secret) {
        try {
          const wh = new Webhook(secret);
          wh.verify(rawBody, headers);
          verified = true;
        } catch {
          // Fall through to try second secret
        }
      }

      // Try Option B (Secondary Inbound Secret)
      if (!verified && inboundSecret) {
        try {
          const wh = new Webhook(inboundSecret);
          wh.verify(rawBody, headers);
          verified = true;
        } catch {
          // Both failed
        }
      }

      if (!verified) {
        return new NextResponse("Webhook verification failed", { status: 400 });
      }
    }

    const type = payload.type;
    const data = payload.data;

    if (!type || !data) {
      return new NextResponse("Invalid payload shape", { status: 400 });
    }

    // ---------------------------------------------------------
    // BRANCH 1: Bounce & Complaints
    // ---------------------------------------------------------
    if (type === "email.bounced" || type === "email.complained") {
      const email = data.to && data.to[0] ? data.to[0] : "";
      
      if (email) {
        const existingLead = await db.select().from(leads).where(eq(leads.email, email)).limit(1);
        if (existingLead.length > 0) {
          await db.update(leads)
            .set({ suppressList: true, status: "rejected" })
            .where(eq(leads.id, existingLead[0].id));
        }
      }
    }
    // ---------------------------------------------------------
    // BRANCH 2: Inbound Replies (email.received)
    // ---------------------------------------------------------
    else if (type === "email.received") {
      // In Resend email.received, `data.from` is the sender. `data.text` is the plain text body.
      const fromEmail = data.from; 
      const textContent = data.text || data.html || "";

      if (fromEmail) {
        // Extract email if it comes in "Name <email@example.com>" format
        const match = fromEmail.match(/<([^>]+)>/);
        const cleanEmail = match ? match[1] : fromEmail.trim();

        const existingLead = await db.select().from(leads).where(eq(leads.email, cleanEmail)).limit(1);
        if (existingLead.length > 0) {
          // Simple AI sentiment simulation (replace with real LLM call if desired)
          let sentiment = "neutral";
          const lowerText = textContent.toLowerCase();
          
          if (lowerText.includes("interested") || lowerText.includes("yes") || lowerText.includes("call") || lowerText.includes("meeting")) {
            sentiment = "interested";
          }
          if (lowerText.includes("unsubscribe") || lowerText.includes("stop") || lowerText.includes("not interested")) {
            sentiment = "not_interested";
          }

          let aiSuggestedResponse = null;
          if (sentiment === "interested") {
            aiSuggestedResponse = `Hi ${existingLead[0].name || 'there'},\n\nGreat to hear from you! What time works best for a quick 10-minute call this week?\n\nBest,\nAdnan Ansari`;
          }

          await db.insert(replies).values({
            leadId: existingLead[0].id,
            messageId: data.id || `webhook-reply-${Date.now()}`,
            content: textContent,
            sentiment: sentiment,
            aiSuggestedResponse: aiSuggestedResponse,
            status: "pending"
          });

          // Update lead status
          if (sentiment === "not_interested") {
            await db.update(leads)
              .set({ suppressList: true, status: "rejected" })
              .where(eq(leads.id, existingLead[0].id));
          } else {
            await db.update(leads)
              .set({ status: "contacted" })
              .where(eq(leads.id, existingLead[0].id));
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Webhook Error:", errorMessage);
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }
}
