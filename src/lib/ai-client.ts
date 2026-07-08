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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (res.status === 429 || !res.ok) return null;
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch {
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
        model: "llama-3.3-70b-versatile",
        messages: chatMessages,
        max_tokens: 500,
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
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: chatMessages,
        max_tokens: 500,
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

    if (res.status === 429 || !res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

// ─── Main Fallback Chain function ─────────────────────────────────────────────
/**
 * Tries multiple AI providers in sequence: Gemini -> Groq -> OpenRouter -> Cerebras.
 * If all fail, throws an error so the caller knows it failed.
 */
export async function generateWithFallback(
  prompt: string | Message[],
  systemPrompt?: string
): Promise<string> {
  const messages: Message[] = typeof prompt === "string" 
    ? [{ role: "user", text: prompt }] 
    : prompt.slice(-8); // Keep last 8 for chat context

  // [1] Gemini
  // We can check multiple Gemini keys if provided in env
  const geminiKeys = [
    process.env.GEMINI_API_KEY_CHAT,
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ].filter(Boolean) as string[];

  for (const key of geminiKeys) {
    const reply = await tryGemini(key, messages, systemPrompt);
    if (reply) return reply;
  }
  console.warn("[AI Client] Gemini quota hit/exhausted → trying Groq");

  // [2] Groq
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    const reply = await tryGroq(groqKey, messages, systemPrompt);
    if (reply) return reply;
    console.warn("[AI Client] Groq quota hit → trying OpenRouter");
  }

  // [3] OpenRouter
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    const reply = await tryOpenRouter(openrouterKey, messages, systemPrompt);
    if (reply) return reply;
    console.warn("[AI Client] OpenRouter quota hit → trying Cerebras");
  }

  // [4] Cerebras
  const cerebrasKey = process.env.CEREBRAS_API_KEY;
  if (cerebrasKey) {
    const reply = await tryCerebras(cerebrasKey, messages, systemPrompt);
    if (reply) return reply;
    console.warn("[AI Client] Cerebras quota hit → all providers exhausted");
  }

  throw new Error("All AI providers (Gemini, Groq, OpenRouter, Cerebras) quota exhausted or failed.");
}
