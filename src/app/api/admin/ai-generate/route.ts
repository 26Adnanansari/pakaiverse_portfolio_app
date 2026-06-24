import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API error:", err);
      // Return the actual error message for easier debugging
      return NextResponse.json({ error: `AI generation failed: ${err.substring(0, 100)}` }, { status: 500 });
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!content) {
      return NextResponse.json({ error: "No content generated" }, { status: 500 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("AI generate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
