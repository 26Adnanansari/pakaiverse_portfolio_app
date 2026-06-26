import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";

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

// ─── Provider 1: Google Gemini ────────────────────────────────────────────────
async function tryGemini(key: string, messages: { role: string; text: string }[]): Promise<string | null> {
  try {
    const contents = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { temperature: 0.6, maxOutputTokens: 300 },
        }),
      }
    );

    if (res.status === 429 || !res.ok) return null;
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

// ─── Provider 2: Groq (Llama 3.3 70B) ────────────────────────────────────────
async function tryGroq(key: string, messages: { role: string; text: string }[]): Promise<string | null> {
  try {
    const chatMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      })),
    ];

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: chatMessages,
        max_tokens: 300,
        temperature: 0.6,
      }),
    });

    if (res.status === 429 || !res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

// ─── Provider 3: OpenRouter (Free models) ────────────────────────────────────
async function tryOpenRouter(key: string, messages: { role: string; text: string }[]): Promise<string | null> {
  try {
    const chatMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      })),
    ];

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "HTTP-Referer": "https://pakaiverse.com",
        "X-Title": "PakAiVerse ChatBot",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: chatMessages,
        max_tokens: 300,
        temperature: 0.6,
      }),
    });

    if (res.status === 429 || !res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

// ─── Provider 4: Cerebras (Llama 3.3 70B) ────────────────────────────────────
async function tryCerebras(key: string, messages: { role: string; text: string }[]): Promise<string | null> {
  try {
    const chatMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      })),
    ];

    const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b",
        messages: chatMessages,
        max_tokens: 300,
        temperature: 0.6,
      }),
    });

    if (res.status === 429 || !res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

// ─── Main fallback chain ──────────────────────────────────────────────────────
async function getAIReply(messages: { role: string; text: string }[]): Promise<string> {
  const recent = messages.slice(-8);

  // [1] Gemini — primary
  const geminiKey = process.env.GEMINI_API_KEY_CHAT;
  if (geminiKey) {
    const reply = await tryGemini(geminiKey, recent);
    if (reply) return reply;
    console.warn("[PakAiBot] Gemini quota hit → trying Groq");
  }

  // [2] Groq — Llama 3.3 70B
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    const reply = await tryGroq(groqKey, recent);
    if (reply) return reply;
    console.warn("[PakAiBot] Groq quota hit → trying OpenRouter");
  }

  // [3] OpenRouter — free models
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    const reply = await tryOpenRouter(openrouterKey, recent);
    if (reply) return reply;
    console.warn("[PakAiBot] OpenRouter quota hit → trying Cerebras");
  }

  // [4] Cerebras — backup
  const cerebrasKey = process.env.CEREBRAS_API_KEY;
  if (cerebrasKey) {
    const reply = await tryCerebras(cerebrasKey, recent);
    if (reply) return reply;
    console.warn("[PakAiBot] Cerebras quota hit → all providers exhausted");
  }

  // All failed — friendly message (user won't know it's a limit)
  return "Abhi thodi busy hoon 😅 Please ek minute mein dobara try karein, ya WhatsApp/email ke zariye hum se directly rabta karein — hum jald respond karen ge!";
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
