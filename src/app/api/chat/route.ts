import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { generateWithFallback } from "@/lib/ai-client";

const SYSTEM_PROMPT = `You are PakAiBot, official AI assistant for PakAiVerse (pakaiverse.com). Founder: Adnan Ansari — AI & Web Developer, Pakistan.

STRICT RULE: ONLY answer about PakAiVerse. For unrelated questions, say: "I'm here to help with PakAiVerse services. What project can I help you with?"

SERVICES: Custom Web Apps, SaaS Platforms, E-commerce, SEO, AI Integration, POS Systems, Admin Dashboards, Mobile-responsive Design, Guest Posting.

LIVE PROJECTS: fashion.pakaiverse.com (multi-vendor fashion), zamzampress.pakaiverse.com (B2B catalog), bushrascollections.com (ladies fashion store), Special Children Institute App (NGO), Ammar Publish (SaaS), Perahan (boutique), ProTax US (tax SaaS), Kami Foods (restaurant app).

TECH: Next.js, React, Node.js, TypeScript, PostgreSQL, Drizzle ORM, Tailwind, Framer Motion, Vercel, Stripe, Gemini AI.

PRICING (approximate): Landing page from $100 | Web app from $300 | SaaS from $500 | E-commerce from $200 | SEO from $50/month. Always say "Final price discussed after requirement review."

PROCESS: Discuss → 50% advance → Build (1-6 weeks) → Launch → 1 month free support.

CAPABILITIES: Small to large web apps, SaaS, e-commerce, POS, dashboards, AI tools. We take complex projects too. Cannot build native mobile apps.

NEW COMMUNICATION RULES:
1. Language Match: ALWAYS reply in the exact language the user used in their most recent message (e.g., if user writes English, reply in English. If Roman Urdu, reply in Roman Urdu).
2. Active Listening: Let the client explain in their own words.
3. Natural Flow: Gather contact details naturally. Do not force them.
4. Short Answers: Keep ALL responses under 2-3 short, polite sentences. Do NOT say "thanks" or "I will generate a summary" in every message. Keep it conversational.

THE REVIEW & VALIDATION STAGE (FINAL MESSAGE ONLY):
CRITICAL: DO NOT output the <SAVE_LEAD> block early. ONLY output it ONCE at the VERY END of the conversation, when all requirements are finalized and you have asked for contact info.
In your FINAL closing message ONLY, do these two things:
1. Thank the user once, provide a 1-2 line "Project Review Summary", and say we will contact them soon.
2. Output a hidden JSON block exactly like this at the end:
<SAVE_LEAD>
{"name": "Client Name or N/A", "email": "client@email.com or N/A", "phone": "0300... or N/A", "budget": "$... or N/A", "projectType": "Web App... or N/A", "message": "Detailed Project Review Summary..."}
</SAVE_LEAD>`;

// ─── Main fallback chain ──────────────────────────────────────────────────────
async function getAIReply(messages: { role: string; text: string }[]): Promise<string> {
  try {
    return await generateWithFallback(messages, SYSTEM_PROMPT);
  } catch (error) {
    console.error("[PakAiBot] All AI providers failed:", error);
    // All failed — friendly message (user won't know it's a limit)
    return "Abhi thodi busy hoon 😅 Please ek minute mein dobara try karein, ya WhatsApp/email ke zariye hum se directly rabta karein — hum jald respond karen ge!";
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    let reply = await getAIReply(messages);

    // Extract <SAVE_LEAD> block if present
    const leadMatch = reply.match(/<SAVE_LEAD>([\s\S]*?)<\/SAVE_LEAD>/);
    if (leadMatch) {
      try {
        const leadData = JSON.parse(leadMatch[1]);
        
        let clientEmail = leadData.email;
        if (!clientEmail || clientEmail === "N/A" || !clientEmail.includes("@")) {
          // Generate a Query Number format email if email is missing
          const queryNumber = `Q-${Math.floor(10000 + Math.random() * 90000)}`;
          clientEmail = `${queryNumber}@query.pakaiverse.com`;
          
          // Optionally, inject the query number into the text if the AI didn't do it itself
          if (!reply.includes("Query Number") && !reply.includes("Q-")) {
            reply = reply.replace(/<SAVE_LEAD>[\s\S]*?<\/SAVE_LEAD>/, `\n\nAapka Query Number: ${queryNumber} hai. `);
          }
        }

        await db.insert(leads).values({
          name: leadData.name !== "N/A" ? leadData.name : null,
          email: clientEmail,
          phone: leadData.phone !== "N/A" ? leadData.phone : null,
          projectType: leadData.projectType !== "N/A" ? leadData.projectType : null,
          budget: leadData.budget !== "N/A" ? leadData.budget : null,
          message: leadData.message !== "N/A" ? leadData.message : null,
          source: "chatbot",
          status: "enriched",
        });

      } catch (err) {
        console.error("Failed to parse or save lead:", err);
      }
      
      // Clean the reply to remove the <SAVE_LEAD> block from user view
      reply = reply.replace(/<SAVE_LEAD>[\s\S]*?<\/SAVE_LEAD>/, "").trim();
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[PakAiBot] Fatal error:", error);
    return NextResponse.json({
      reply: "Kuch masla aa gaya. Thodi der mein dobara try karein ya contact@pakaiverse.com pe email karein.",
    });
  }
}
