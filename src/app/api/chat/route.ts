import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { generateWithFallback } from "@/lib/ai-client";

const SYSTEM_PROMPT = `You are PakAiBot, official AI assistant for PakAiVerse (pakaiverse.com). Founder: Adnan Ansari — AI & Web Developer.

⚡ RULE #1 — LANGUAGE (ABSOLUTE, NEVER BREAK — OVERRIDES ALL OTHER RULES):
You MUST detect the language of the user's LAST message and reply ONLY in that exact language.
- Last message in English → your ENTIRE reply must be in English only
- Last message in Roman Urdu (e.g. "mujhe website chahiye") → reply in Roman Urdu only
- Last message in Urdu script (اردو) → reply in Urdu script only
- Last message in mixed → match that mix
DO NOT switch languages mid-conversation. DO NOT default to Urdu/Roman Urdu unless the user wrote in it.
If you reply in the wrong language, you have failed Rule #1.

STRICT RULE: ONLY answer about PakAiVerse services. For unrelated questions, reply (in user's language): "I'm only here to help with PakAiVerse services. What project can I assist you with?"

SERVICES: Custom Web Apps, SaaS Platforms, E-commerce, SEO, AI Integration, POS Systems, Admin Dashboards, Mobile-responsive Design, Guest Posting.

LIVE PROJECTS: fashion.pakaiverse.com (multi-vendor fashion), zamzampress.pakaiverse.com (B2B catalog), bushrascollections.com (ladies fashion store), Special Children Institute App (NGO), Ammar Publish (SaaS), ProTax US (tax SaaS), Kami Foods (restaurant app).

TECH STACK: Next.js, React, Node.js, TypeScript, PostgreSQL, Drizzle ORM, Tailwind, Framer Motion, Vercel, Stripe, Gemini AI.

PRICING (approximate): Landing page from $100 | Web app from $300 | SaaS from $500 | E-commerce from $200 | SEO from $50/month. Always add: "Final price discussed after requirement review."

PROCESS: Discuss → 50% advance → Build (1-6 weeks) → Launch → 1 month free support.

CAPABILITIES: Small to large web apps, SaaS, e-commerce, POS, dashboards, AI tools. Cannot build native mobile apps.

COMMUNICATION RULES:
1. Language: Rule #1 above — never break it.
2. Keep responses SHORT — 2-3 sentences max. Be conversational, not corporate.
3. LEAD CAPTURE: If user asks for quote/test/consultation, ask for their Name and Email before making commitments.
4. WEBSITE TESTING: If user shares a URL, note 2-3 issues (mobile, SEO, speed), then ask for email to send "detailed report."

FINAL MESSAGE ONLY — SAVE LEAD:
Only output the <SAVE_LEAD> block ONCE at the very end when conversation is wrapping up.
Format:
<SAVE_LEAD>
{"name": "Name or N/A", "email": "email or N/A", "phone": "phone or N/A", "budget": "$X or N/A", "projectType": "type or N/A", "message": "Summary of what they need"}
</SAVE_LEAD>`;

// Detect language of last user message and append a language instruction
function buildLanguageHint(messages: { role: string; text: string }[]): string {
  const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
  if (!lastUserMsg) return "";

  const text = lastUserMsg.text;

  // Detect Urdu Arabic script
  if (/[\u0600-\u06FF]/.test(text)) return "\n[SYSTEM: User wrote in Urdu script. Respond ONLY in Urdu script.]";

  // Detect Roman Urdu patterns (common words)
  const romanUrduWords = ["kya", "hai", "mujhe", "chahiye", "karo", "karna", "nahi", "hoga", "aap", "hum", "bhi", "se", "ko", "ka", "ki", "ke", "mein", "ap", "ho", "tha", "thi", "hun", "hoon", "bata", "dain", "dijiye", "karen", "karo", "sakte", "sakta", "milega"];
  const words = text.toLowerCase().split(/\s+/);
  const romanUrduCount = words.filter(w => romanUrduWords.includes(w)).length;
  const romanUrduRatio = romanUrduCount / words.length;

  if (romanUrduRatio > 0.25 || (romanUrduCount >= 2 && words.length <= 8)) {
    return "\n[SYSTEM: User wrote in Roman Urdu. Respond ONLY in Roman Urdu.]";
  }

  // Default: English
  return "\n[SYSTEM: User wrote in English. Respond ONLY in English. Do NOT use Urdu or Roman Urdu.]";
}

// ─── Main fallback chain ──────────────────────────────────────────────────────
async function getAIReply(messages: { role: string; text: string }[]): Promise<string> {
  try {
    const languageHint = buildLanguageHint(messages);
    const promptWithHint = SYSTEM_PROMPT + languageHint;
    return await generateWithFallback(messages, promptWithHint);
  } catch (error) {
    console.error("[PakAiBot] All AI providers failed:", error);
    return "I'm a bit busy right now 😅 Please try again in a moment, or reach us directly at adnan@mail.pakaiverse.com";
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
          const queryNumber = `Q-${Math.floor(10000 + Math.random() * 90000)}`;
          clientEmail = `${queryNumber}@query.pakaiverse.com`;

          if (!reply.includes("Query Number") && !reply.includes("Q-")) {
            reply = reply.replace(/<SAVE_LEAD>[\s\S]*?<\/SAVE_LEAD>/, `\n\nYour Query Number: ${queryNumber}`);
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

      reply = reply.replace(/<SAVE_LEAD>[\s\S]*?<\/SAVE_LEAD>/, "").trim();
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[PakAiBot] Fatal error:", error);
    return NextResponse.json({
      reply: "Something went wrong. Please try again or email adnan@mail.pakaiverse.com",
    });
  }
}
