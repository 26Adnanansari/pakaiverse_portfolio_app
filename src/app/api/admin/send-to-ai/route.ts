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

      // Save to emailQueue as pending (admin must approve to send)
      await db.insert(emailQueue).values({
        leadId: lead.id,
        subject,
        body,
        scheduledAt: new Date(),
        status: "pending",
      });

      // Update lead status to "draft_ready" (only if successful)
      await db.update(leads)
        .set({ status: "draft_ready" })
        .where(eq(leads.id, lead.id));

      results.push({ id: lead.id, name: lead.name, subject });

      // Add 1.5s delay to avoid rapid-fire rate limits on the same AI provider
      // This is crucial since this is a sequential for...of loop processing multiple leads
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
      message: `${results.length} draft(s) created. ${errors.length > 0 ? `(${errors.length} failed)` : ''} Go to Emails tab to review and approve.`,
    });

  } catch (error) {
    console.error("Send to AI error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
