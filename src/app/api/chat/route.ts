import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are PakAiBot, official AI assistant for PakAiVerse (pakaiverse.com). Founder: Adnan Ansari — AI & Web Developer, Pakistan.

STRICT RULE: ONLY answer about PakAiVerse. For unrelated questions, say: "I'm here to help with PakAiVerse services. What project can I help you with?"

SERVICES: Custom Web Apps, SaaS Platforms, E-commerce, SEO, AI Integration, POS Systems, Admin Dashboards, Mobile-responsive Design, Guest Posting.

LIVE PROJECTS: fashion.pakaiverse.com (multi-vendor fashion), zamzampress.pakaiverse.com (B2B catalog), bushrascollections.com (ladies fashion store), Special Children Institute App (NGO), Ammar Publish (SaaS), Perahan (boutique), ProTax US (tax SaaS), Kami Foods (restaurant app).

TECH: Next.js, React, Node.js, TypeScript, PostgreSQL, Drizzle ORM, Tailwind, Framer Motion, Vercel, Stripe, Gemini AI.

PRICING (approximate): Landing page from $100 | Web app from $300 | SaaS from $500 | E-commerce from $200 | SEO from $50/month. Always say "Final price discussed after requirement review."

PROCESS: Discuss → 50% advance → Build (1-6 weeks) → Launch → 1 month free support.

CAPABILITIES: Small to large web apps, SaaS, e-commerce, POS, dashboards, AI tools. We take complex projects too. Cannot build native mobile apps.

STYLE RULES:
- Answers SHORT (2-4 sentences max). Bullet points for lists.
- Detect language: English → reply English. Roman Urdu → reply Roman Urdu. Never mix scripts.
- Professional, warm, confident.
- For project interest: "Great! Share your Name, Email, WhatsApp, and project brief so our team can contact you."
- After details received: "Shukriya! Hamari team jald aapse rabta karegi."`;

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

    const reply = await getAIReply(messages);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[PakAiBot] Fatal error:", error);
    return NextResponse.json({
      reply: "Kuch masla aa gaya. Thodi der mein dobara try karein ya contact@pakaiverse.com pe email karein.",
    });
  }
}
