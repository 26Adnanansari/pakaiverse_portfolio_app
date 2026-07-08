import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads, emailQueue } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { auth } from "@/auth";

// Try multiple API keys in sequence — fallback if one quota is exhausted
async function callGemini(prompt: string): Promise<{ text: string } | { error: string }> {
  const keys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ].filter(Boolean) as string[];

  if (keys.length === 0) return { error: "No Gemini API key configured" };

  for (const key of keys) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.75, maxOutputTokens: 800 },
        }),
      }
    );

    if (response.status === 429) { continue; }
    if (!response.ok) {
      const err = await response.text();
      return { error: `AI failed: ${err.substring(0, 150)}` };
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return { text };
  }

  return { error: "All API keys quota exhausted." };
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { leadIds } = await request.json();

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ success: false, error: "No lead IDs provided" }, { status: 400 });
    }

    // Fetch all leads
    const leadsData = await db
      .select()
      .from(leads)
      .where(inArray(leads.id, leadIds));

    if (leadsData.length === 0) {
      return NextResponse.json({ success: false, error: "No leads found" }, { status: 404 });
    }

    const results = [];
    const errors = [];

    for (const lead of leadsData) {
      // Skip leads without a real email
      if (!lead.email || lead.email.startsWith("pending_enrichment_")) {
        errors.push({ id: lead.id, reason: "No valid email" });
        continue;
      }

      const leadName = lead.name || "Business Owner";
      const niche = lead.projectType || "your business";
      const contextNotes = lead.message?.substring(0, 300) || "";

      const prompt = `You are an outreach specialist for PakAiVerse, a premium AI-powered web development agency based in Pakistan.

Write a SHORT, personalized cold outreach email to ${leadName} who runs a ${niche} business.

Context about this lead: ${contextNotes}

Rules:
- Max 120 words in body (very concise)
- Mention their specific niche (${niche}) naturally
- Focus on one clear value proposition: we build modern AI-powered websites that get them more customers
- End with a soft CTA like "Would you be open to a quick 15-minute call this week?"
- Friendly, professional tone — not pushy
- Do NOT include subject line in body
- Write in plain text, no HTML tags
- Sign off as: Adnan | PakAiVerse

Return this exact format (nothing else):
SUBJECT: [your subject here]
BODY:
[email body here]`;

      const aiResult = await callGemini(prompt);

      if ("error" in aiResult) {
        errors.push({ id: lead.id, reason: aiResult.error });
        continue;
      }

      // Parse subject and body from AI output
      const rawText = aiResult.text.trim();
      const subjectMatch = rawText.match(/^SUBJECT:\s*(.+)/m);
      const bodyMatch = rawText.match(/BODY:\n([\s\S]+)/m);

      const subject = subjectMatch ? subjectMatch[1].trim() : `Quick Question for ${leadName}`;
      const body = bodyMatch ? bodyMatch[1].trim() : rawText;

      // Save to emailQueue as pending (admin must approve to send)
      await db.insert(emailQueue).values({
        leadId: lead.id,
        subject,
        body,
        scheduledAt: new Date(),
        status: "pending",
      });

      // Update lead status to "draft_ready"
      await db.update(leads)
        .set({ status: "draft_ready" })
        .where(eq(leads.id, lead.id));

      results.push({ id: lead.id, name: lead.name, subject });
    }

    return NextResponse.json({
      success: true,
      drafted: results.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `${results.length} draft(s) created. Go to Emails tab to review and approve.`,
    });

  } catch (error) {
    console.error("Send to AI error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
