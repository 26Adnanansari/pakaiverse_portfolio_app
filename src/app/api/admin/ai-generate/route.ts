import { NextResponse } from "next/server";

// Try multiple API keys in sequence — fallback if one quota is exhausted
async function callGemini(prompt: string): Promise<{ text: string } | { error: string; status: number }> {
  const keys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ].filter(Boolean) as string[];

  if (keys.length === 0) {
    return { error: "No Gemini API key configured", status: 500 };
  }

  for (const key of keys) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    // If quota exceeded, try next key
    if (response.status === 429) {
      console.warn("Gemini key quota exceeded, trying next key...");
      continue;
    }

    if (!response.ok) {
      const err = await response.text();
      return { error: `AI generation failed: ${err.substring(0, 150)}`, status: 500 };
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return { text };
  }

  return { error: "All API keys quota exhausted. Please try again later.", status: 429 };
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const prompt = `Write a comprehensive, SEO-optimized blog article for the title: "${title}"

Requirements:
- Write in professional English
- Minimum 1000 words
- Use proper HTML formatting with <h2>, <h3>, <p>, <ul>, <li>, <strong> tags
- Start with an engaging introduction paragraph (no heading)
- Include 3-4 main sections with <h2> headings
- Add sub-sections with <h3> where appropriate
- Include bullet points and numbered lists for readability  
- Add a conclusion section
- Make it informative, expert-level content
- Target: tech businesses, developers, and entrepreneurs in Pakistan and global markets
- Naturally mention AI, web development, SaaS where relevant to topic
- Do NOT include markdown (no ## or **), only clean HTML tags
- Do NOT wrap in <html>, <body>, or <article> tags
- Start directly with the first paragraph

Return ONLY the HTML content, nothing else.`;

    const result = await callGemini(prompt);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    if (!result.text) {
      return NextResponse.json({ error: "No content generated" }, { status: 500 });
    }

    return NextResponse.json({ content: result.text });
  } catch (error) {
    console.error("AI generate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
