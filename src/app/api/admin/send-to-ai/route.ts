import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads, emailQueue } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { auth } from "@/auth";
import { generateWithFallback } from "@/lib/ai-client";

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

    const leadsData = await db.select().from(leads).where(inArray(leads.id, leadIds));

    if (leadsData.length === 0) {
      return NextResponse.json({ success: false, error: "No leads found" }, { status: 404 });
    }

    const results = [];
    const errors = [];

    for (const lead of leadsData) {
      if (!lead.email || lead.email.startsWith("pending_enrichment_")) {
        errors.push({ id: lead.id, reason: "No valid email" });
        continue;
      }

      const leadName = lead.name || "Business Owner";
      const niche = lead.projectType || "business";
      const website = lead.websiteUrl || "";
      const contextNotes = (lead.contextNotes || "").trim();

      // Context-driven vs fallback prompt strategy
      let contextSection: string;
      if (contextNotes.length > 10) {
        // PRIMARY PATH: Admin wrote specific observations — make this the email's core
        contextSection = `
SPECIFIC CONTEXT FROM ADMIN (THIS IS THE MOST IMPORTANT PART — base the email's angle and hook primarily on these notes):
"${contextNotes}"

You MUST pull out the specific point(s) made in these notes and build the email around them.
Do not write a generic email — this context must be the central angle of the message.
If the notes are in Roman Urdu or mixed language, extract the key points and write the email professionally in English.`;
      } else {
        // FALLBACK PATH: No custom context — use available signals
        contextSection = `
Available signals (use whichever are relevant):
- Niche/category: ${niche}
- Website: ${website ? website : "they appear to have no website (make this the hook — offer to build them one)"}
- No specific notes from admin — write a warm, genuine outreach based on their niche`;
      }

      const prompt = `You are Adnan from PakAiVerse — a small AI-powered web dev agency based in Pakistan. You're writing a personal cold outreach email.

Your tone: warm, genuine, human — like one business owner reaching out to another. NOT corporate. NOT stiff. NOT a sales pitch. Conversational but professional.

Lead name: ${leadName}
Business type: ${niche}
${contextSection}

STRICT RULES:
- Write EXACTLY 3 short paragraphs. Each paragraph = 2-3 sentences max.
- Paragraph 1: Open with something specific and genuine about THEIR business (using the context above). Not "I hope this finds you well."
- Paragraph 2: Explain naturally (not salesy) how PakAiVerse could specifically help them — tied to the context.
- Paragraph 3: Soft CTA — "Would you be open to a quick 15-minute chat?" or similar.
- Max 120 words total in body
- Sign off as: Adnan | PakAiVerse
- DO NOT start with "I hope", "We are", or "My name is"
- DO NOT use exclamation marks excessively
- Write in plain text, no HTML
- CRITICAL: Separate each paragraph with a blank line (double newline)

Return ONLY this format:
SUBJECT: [one short, specific, non-clickbait subject line]
BODY:
[paragraph 1]

[paragraph 2]

[paragraph 3]

[sign off]`;

      let rawText = "";
      try {
        rawText = await generateWithFallback(prompt);
      } catch (aiError: unknown) {
        const errorMessage = aiError instanceof Error ? aiError.message : "AI fallback chain failed";
        errors.push({ id: lead.id, reason: errorMessage });
        await db.update(leads).set({ status: "ai-failed" }).where(eq(leads.id, lead.id));
        continue;
      }

      const subjectMatch = rawText.match(/^SUBJECT:\s*(.+)/m);
      const bodyMatch = rawText.match(/BODY:\n([\s\S]+)/m);

      const subject = subjectMatch ? subjectMatch[1].trim() : `Quick Question for ${leadName}`;
      const body = bodyMatch ? bodyMatch[1].trim() : rawText;

      await db.insert(emailQueue).values({
        leadId: lead.id,
        subject,
        body,
        scheduledAt: new Date(),
        status: "pending",
      });

      await db.update(leads).set({ status: "draft_ready" }).where(eq(leads.id, lead.id));

      results.push({ id: lead.id, name: lead.name, subject });

      await new Promise(res => setTimeout(res, 1500));
    }

    if (results.length === 0) {
      const errorMsg = errors.map(e => `Lead ${e.id}: ${e.reason}`).join(", ");
      return NextResponse.json({
        success: false,
        error: `0 drafts created. Reasons: ${errorMsg || "Unknown error"}`
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      drafted: results.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `${results.length} draft(s) created. ${errors.length > 0 ? `(${errors.length} failed)` : ""} Go to Emails tab to review and approve.`,
    });

  } catch (error) {
    console.error("Send to AI error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
