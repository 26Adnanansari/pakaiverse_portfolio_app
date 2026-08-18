import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, unknown> = {};

  // Test Gemini Keys
  const geminiKeys = [
    { name: "GEMINI_API_KEY_CHAT", key: process.env.GEMINI_API_KEY_CHAT },
    { name: "GEMINI_API_KEY", key: process.env.GEMINI_API_KEY },
    { name: "GEMINI_API_KEY_2", key: process.env.GEMINI_API_KEY_2 },
    { name: "GEMINI_API_KEY_3", key: process.env.GEMINI_API_KEY_3 },
    { name: "GEMINI_API_KEY_BLOG", key: process.env.GEMINI_API_KEY_BLOG },
  ];

  const geminiResults: Record<string, unknown>[] = [];
  results.gemini = geminiResults;

  for (const { name, key } of geminiKeys) {
    if (!key) {
      geminiResults.push({ name, status: "MISSING" });
      continue;
    }

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: "hi" }] }],
          }),
        }
      );

      const status = res.status;
      const ok = res.ok;
      const text = await res.text();
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        // Not JSON
      }

      geminiResults.push({
        name,
        exists: true,
        keyPrefix: key.substring(0, 8) + "...",
        keyLength: key.length,
        status,
        ok,
        error: ok ? null : parsed || text.substring(0, 300),
      });
    } catch (err: unknown) {
      geminiResults.push({
        name,
        exists: true,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Test Groq
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: "hi" }],
          max_tokens: 10,
        }),
      });
      const ok = res.ok;
      const text = await res.text();
      results.groq = {
        exists: true,
        keyPrefix: groqKey.substring(0, 8) + "...",
        keyLength: groqKey.length,
        status: res.status,
        ok,
        error: ok ? null : text.substring(0, 300),
      };
    } catch (err: unknown) {
      results.groq = { exists: true, error: err instanceof Error ? err.message : String(err) };
    }
  } else {
    results.groq = { status: "MISSING" };
  }

  // Test OpenRouter
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openrouterKey}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct:free",
          messages: [{ role: "user", content: "hi" }],
          max_tokens: 10,
        }),
      });
      const ok = res.ok;
      const text = await res.text();
      results.openrouter = {
        exists: true,
        keyPrefix: openrouterKey.substring(0, 8) + "...",
        keyLength: openrouterKey.length,
        status: res.status,
        ok,
        error: ok ? null : text.substring(0, 300),
      };
    } catch (err: unknown) {
      results.openrouter = { exists: true, error: err instanceof Error ? err.message : String(err) };
    }
  } else {
    results.openrouter = { status: "MISSING" };
  }

  return NextResponse.json(results);
}
