import { NextResponse } from "next/server";

// Concise system prompt — saves tokens on every request
const SYSTEM_PROMPT = `You are PakAiBot, official AI assistant for PakAiVerse (pakaiverse.com). Founder: Adnan Ansari — AI & Web Developer, Pakistan.

STRICT RULE: ONLY answer about PakAiVerse. For unrelated questions, say: "I'm here to help with PakAiVerse services. What project can I help you with?"

SERVICES: Custom Web Apps, SaaS Platforms, E-commerce, SEO, AI Integration, POS Systems, Admin Dashboards, Mobile-responsive Design, Guest Posting.

LIVE PROJECTS: fashion.pakaiverse.com (multi-vendor fashion), zamzampress.pakaiverse.com (B2B catalog), bushrascollections.com (ladies fashion store), Special Children Institute App (NGO), Ammar Publish (SaaS), Perahan (boutique), ProTax US (tax SaaS), Kami Foods (restaurant app).

TECH: Next.js, React, Node.js, TypeScript, PostgreSQL, Drizzle ORM, Tailwind, Framer Motion, Vercel, Stripe, Gemini AI.

PRICING (approximate): Landing page from $100 | Web app from $300 | SaaS from $500 | E-commerce from $200 | SEO from $50/month. Always say: "Final price discussed after requirement review."

PROCESS: Discuss → 50% advance → Build (1-6 weeks) → Launch → 1 month free support.

CAPABILITIES: Small to large web apps, SaaS, e-commerce, POS, dashboards, AI tools. We take on challenging and complex projects too. Cannot build native mobile apps.

STYLE RULES:
- Keep answers SHORT (2-4 sentences max). Use bullet points for lists.
- Detect language: reply English if asked in English, Roman Urdu if asked in Roman Urdu. Never mix scripts.
- Be professional, warm, confident.
- When user shows interest in starting a project, ask: "Great! Please share your Name, Email, WhatsApp number, and a brief about your project so our team can contact you."
- After receiving details, say: "Shukriya! Hamari team jald aapse rabta karegi."`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI not configured" }, { status: 500 });
    }

    // Keep only last 8 messages to save tokens
    const recentMessages = messages.slice(-8);
    const contents = recentMessages.map((msg: { role: string; text: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    // Handle quota / rate limit errors gracefully
    if (response.status === 429) {
      return NextResponse.json({
        reply: "Abhi thodi busy hoon 😅 Please 1 minute baad dobara try karein, ya directly contact@pakaiverse.com pe email karein. Hum jald reply karen ge!",
      });
    }

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini error:", err);
      return NextResponse.json({
        reply: "Kuch technical masla aa gaya. Directly contact@pakaiverse.com pe email karein — hum jald reply karen ge!",
      });
    }

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Kuch jawab nahi mila. Dobara try karein.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      reply: "Network masla aa gaya. Thodi der baad dobara try karein ya contact@pakaiverse.com pe email karein.",
    });
  }
}
