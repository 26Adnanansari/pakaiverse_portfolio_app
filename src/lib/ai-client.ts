// ─── Shared AI Client with Provider Fallbacks ──────────────────────────────
export type Message = { role: string; text: string };

// Provider 1: Google Gemini (Primary)
async function tryGemini(key: string, messages: Message[], systemPrompt?: string): Promise<string | null> {
  try {
    const contents = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const body: Record<string, unknown> = {
      contents,
      generationConfig: { temperature: 0.6, maxOutputTokens: 500 },
    };

    if (systemPrompt) {
      body.systemInstruction = { parts: [{ text: systemPrompt }] };
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.warn(`[AI Client] Gemini failed — status: ${res.status} | key prefix: ${key.substring(0, 8)}... | body: ${errBody.substring(0, 200)}`);
      return null;
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    if (!text) {
      console.warn("[AI Client] Gemini returned empty response:", JSON.stringify(data).substring(0, 300));
    }
    return text;
  } catch (err) {
    console.error("[AI Client] Gemini exception:", err);
    return null;
  }
}

// Provider 2: Groq (Llama 3.3 70B)
async function tryGroq(key: string, messages: Message[], systemPrompt?: string): Promise<string | null> {
  try {
    const chatMessages: Record<string, unknown>[] = [];
    if (systemPrompt) {
      chatMessages.push({ role: "system", content: systemPrompt });
    }
    messages.forEach((m) => {
      chatMessages.push({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      });
    });

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: chatMessages,
        max_tokens: 500,
        temperature: 0.6,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.warn(`[AI Client] Groq failed — status: ${res.status} | key prefix: ${key.substring(0, 8)}... | body: ${errBody.substring(0, 200)}`);
      return null;
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content ?? null;
    if (!text) {
      console.warn("[AI Client] Groq returned empty response:", JSON.stringify(data).substring(0, 300));
    }
    return text;
  } catch (err) {
    console.error("[AI Client] Groq exception:", err);
    return null;
  }
}

// Provider 3: OpenRouter (Free models)
async function tryOpenRouter(key: string, messages: Message[], systemPrompt?: string): Promise<string | null> {
  try {
    const chatMessages: Record<string, unknown>[] = [];
    if (systemPrompt) {
      chatMessages.push({ role: "system", content: systemPrompt });
    }
    messages.forEach((m) => {
      chatMessages.push({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      });
    });

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "HTTP-Referer": "https://pakaiverse.com",
        "X-Title": "PakAiVerse Services",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: chatMessages,
        max_tokens: 500,
        temperature: 0.6,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.warn(`[AI Client] OpenRouter failed — status: ${res.status} | body: ${errBody.substring(0, 200)}`);
      return null;
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? null;
  } catch (err) {
    console.error("[AI Client] OpenRouter exception:", err);
    return null;
  }
}

// Provider 4: Cerebras (Llama 3.3 70B)
async function tryCerebras(key: string, messages: Message[], systemPrompt?: string): Promise<string | null> {
  try {
    const chatMessages: Record<string, unknown>[] = [];
    if (systemPrompt) {
      chatMessages.push({ role: "system", content: systemPrompt });
    }
    messages.forEach((m) => {
      chatMessages.push({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      });
    });

    const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b",
        messages: chatMessages,
        max_tokens: 500,
        temperature: 0.6,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.warn(`[AI Client] Cerebras failed — status: ${res.status} | body: ${errBody.substring(0, 200)}`);
      return null;
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? null;
  } catch (err) {
    console.error("[AI Client] Cerebras exception:", err);
    return null;
  }
}

// ─── Main Fallback Chain function ─────────────────────────────────────────────
/**
 * Tries multiple AI providers in sequence: Gemini → Groq → OpenRouter → Cerebras.
 * If all fail, throws an error so the caller knows it failed.
 */
export async function generateWithFallback(
  prompt: string | Message[],
  systemPrompt?: string,
  caller: "chat" | "email" = "chat"
): Promise<string> {
  const messages: Message[] = typeof prompt === "string"
    ? [{ role: "user", text: prompt }]
    : prompt.slice(-8); // Keep last 8 for chat context

  console.log(`[AI Client] Starting fallback chain with ${messages.length} messages (caller: ${caller})`);

  // [1] Gemini — check multiple possible keys prioritized by caller
  let geminiKeys: string[] = [];

  if (caller === "chat") {
    // For Chat: prioritize chat-specific key, then general keys, and blog key as last resort
    geminiKeys = [
      process.env.GEMINI_API_KEY_CHAT,
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_BLOG,
    ].filter(Boolean) as string[];
  } else {
    // For Emails/Outreach: prioritize general keys, then blog key, and chat key only as absolute last resort
    geminiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_BLOG,
      process.env.GEMINI_API_KEY_CHAT,
    ].filter(Boolean) as string[];
  }

  console.log(`[AI Client] Found ${geminiKeys.length} Gemini key(s) for caller: ${caller}`);

  for (const key of geminiKeys) {
    const reply = await tryGemini(key, messages, systemPrompt);
    if (reply) {
      console.log("[AI Client] ✅ Gemini responded successfully");
      return reply;
    }
  }
  console.warn("[AI Client] ❌ All Gemini keys failed → trying Groq");

  // [2] Groq
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    console.log("[AI Client] Trying Groq...");
    const reply = await tryGroq(groqKey, messages, systemPrompt);
    if (reply) {
      console.log("[AI Client] ✅ Groq responded successfully");
      return reply;
    }
    console.warn("[AI Client] ❌ Groq failed → trying OpenRouter");
  } else {
    console.warn("[AI Client] ⚠️ GROQ_API_KEY not set — skipping");
  }

  // [3] OpenRouter
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    console.log("[AI Client] Trying OpenRouter...");
    const reply = await tryOpenRouter(openrouterKey, messages, systemPrompt);
    if (reply) {
      console.log("[AI Client] ✅ OpenRouter responded successfully");
      return reply;
    }
    console.warn("[AI Client] ❌ OpenRouter failed → trying Cerebras");
  } else {
    console.warn("[AI Client] ⚠️ OPENROUTER_API_KEY not set — skipping");
  }

  // [4] Cerebras
  const cerebrasKey = process.env.CEREBRAS_API_KEY;
  if (cerebrasKey) {
    console.log("[AI Client] Trying Cerebras...");
    const reply = await tryCerebras(cerebrasKey, messages, systemPrompt);
    if (reply) {
      console.log("[AI Client] ✅ Cerebras responded successfully");
      return reply;
    }
    console.warn("[AI Client] ❌ Cerebras failed → all providers exhausted");
  } else {
    console.warn("[AI Client] ⚠️ CEREBRAS_API_KEY not set — skipping");
  }

  throw new Error("All AI providers (Gemini, Groq, OpenRouter, Cerebras) quota exhausted or failed.");
}
