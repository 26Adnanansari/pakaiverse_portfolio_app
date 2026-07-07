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
    
    if (secret) {
      const svix_id = req.headers.get("svix-id");
      const svix_timestamp = req.headers.get("svix-timestamp");
      const svix_signature = req.headers.get("svix-signature");

      if (!svix_id || !svix_timestamp || !svix_signature) {
        return new NextResponse("Error occured -- no svix headers", { status: 400 });
      }

      const wh = new Webhook(secret);
      wh.verify(rawBody, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    }

    const type = payload.type;
    const data = payload.data;

    // Handle Bounced or Complained
    if (type === "email.bounced" || type === "email.complained") {
      const email = data.to[0]; // recipient email
      
      // Suppress the lead
      const existingLead = await db.select().from(leads).where(eq(leads.email, email)).limit(1);
      if (existingLead.length > 0) {
        await db.update(leads)
          .set({ suppressList: true, status: "rejected" })
          .where(eq(leads.id, existingLead[0].id));
      }
    }

    // Handle Replied (Simulated - Resend doesn't have a native 'email.replied' without inbound routing)
    // If using Resend Inbound Routing, the payload is different. We assume 'email.replied' or similar custom webhook logic.
    if (type === "email.replied" || payload.recordType === "inbound") {
      const fromEmail = data.from; // prospect email
      const textContent = data.text || data.html || "";

      const existingLead = await db.select().from(leads).where(eq(leads.email, fromEmail)).limit(1);
      if (existingLead.length > 0) {
        // Simple AI logic simulation (In reality, pass `textContent` to OpenAI/Gemini)
        let sentiment = "neutral";
        if (textContent.toLowerCase().includes("interested") || textContent.toLowerCase().includes("yes")) sentiment = "interested";
        if (textContent.toLowerCase().includes("unsubscribe") || textContent.toLowerCase().includes("stop")) sentiment = "not_interested";

        await db.insert(replies).values({
          leadId: existingLead[0].id,
          messageId: data.id || "webhook-reply",
          content: textContent,
          sentiment: sentiment,
          aiSuggestedResponse: sentiment === "interested" ? "Great! What time works for a quick call?" : null,
          status: "pending"
        });

        if (sentiment === "not_interested") {
          await db.update(leads)
            .set({ suppressList: true, status: "rejected" })
            .where(eq(leads.id, existingLead[0].id));
        } else {
          await db.update(leads)
            .set({ status: "contacted" }) // or 'replied'
            .where(eq(leads.id, existingLead[0].id));
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
