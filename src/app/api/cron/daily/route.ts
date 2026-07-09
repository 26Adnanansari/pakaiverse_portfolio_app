import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads, emailQueue } from "@/db/schema";
import { eq, and, lte, asc } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import { getBaseEmailTemplate, getAdminSummaryTemplate } from "@/lib/email-templates";

// Ensure this route is dynamic and handled as a cron job
export const dynamic = "force-dynamic";

const DAILY_LIMIT = 25; // 20-30/day target
const MAX_FOLLOW_UPS = 2;

export async function GET(req: Request) {
  // Validate CRON_SECRET if it's set in env to prevent unauthorized execution
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // 1. Fetch pending emails that are scheduled for now or in the past
    const pendingEmails = await db
      .select({
        id: emailQueue.id,
        leadId: emailQueue.leadId,
        subject: emailQueue.subject,
        body: emailQueue.body,
        attempts: emailQueue.attempts,
        leadSuppressList: leads.suppressList,
        leadEmail: leads.email,
        leadFollowUpCount: leads.followUpCount,
      })
      .from(emailQueue)
      .leftJoin(leads, eq(emailQueue.leadId, leads.id))
      .where(
        and(
          eq(emailQueue.status, "pending"),
          lte(emailQueue.scheduledAt, new Date())
        )
      )
      .orderBy(asc(emailQueue.scheduledAt))
      .limit(DAILY_LIMIT);

    if (pendingEmails.length === 0) {
      return NextResponse.json({ success: true, message: "No pending emails in queue." });
    }

    let sentCount = 0;
    let followUpScheduledCount = 0;
    const errors: { id: number; error: string }[] = [];

    // 2. Iterate through and send emails
    for (const item of pendingEmails) {
      // 3. Spacing logic (mocking spacing by only taking the current batch and spacing them if it was a long running process, 
      // but typically Vercel Serverless functions timeout after 10-60s. 
      // For true 3-5 min spacing on serverless, the cron should run every 5 mins and process 1 email at a time.
      // Since it's a daily cron, we will send them out but in reality a Queue service like Upstash QStash is better.
      // For now, we process them sequentially with a small delay just to avoid rate limiting on the API itself.
      
      // Check if lead is suppressed or doesn't exist
      if (!item.leadEmail || item.leadSuppressList) {
        await db.update(emailQueue)
          .set({ status: "cancelled", errorLog: "Lead is suppressed or missing email" })
          .where(eq(emailQueue.id, item.id));
        continue;
      }

      // Send the email
      try {
        const wrappedHtml = getBaseEmailTemplate({ 
          content: item.body, 
          companyName: "Your Company", // In reality, fetch from lead.companyName if available
          leadId: item.leadId?.toString()
        });

        const sendResult = await sendEmail({
          to: item.leadEmail,
          subject: item.subject,
          html: wrappedHtml,
        });

        if (sendResult.id || sendResult.success) { // Resend returns id, Nodemailer returns success
          // Mark as sent
          await db.update(emailQueue)
            .set({ status: "sent", updatedAt: new Date() })
            .where(eq(emailQueue.id, item.id));

          // Update Lead status
          const newFollowUpCount = (item.leadFollowUpCount || 0) + 1;
          await db.update(leads)
            .set({ 
              status: "contacted", 
              followUpCount: newFollowUpCount, 
              lastEmailedAt: new Date() 
            })
            .where(eq(leads.id, item.leadId!));

          sentCount++;

          // Schedule follow up if under max
          if (newFollowUpCount < MAX_FOLLOW_UPS) {
            const followUpDate = new Date();
            followUpDate.setDate(followUpDate.getDate() + 4); // +4 days

            await db.insert(emailQueue).values({
              leadId: item.leadId,
              subject: `Re: ${item.subject}`,
              body: `Hi again,<br><br>Just following up on my previous email. Let me know if you are interested.<br><br>Thanks.`,
              scheduledAt: followUpDate,
              status: "pending"
            });
            followUpScheduledCount++;
          }
        } else {
          // Failed to send
          await db.update(emailQueue)
            .set({ 
              attempts: (item.attempts || 0) + 1,
              status: ((item.attempts || 0) + 1) >= 3 ? "failed" : "pending",
              errorLog: sendResult.error || "Unknown send error"
            })
            .where(eq(emailQueue.id, item.id));
        }

      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        errors.push({ id: item.id, error: errorMessage });
        await db.update(emailQueue)
            .set({ 
              attempts: (item.attempts || 0) + 1,
              status: ((item.attempts || 0) + 1) >= 3 ? "failed" : "pending",
              errorLog: errorMessage
            })
            .where(eq(emailQueue.id, item.id));
      }

      // Small delay between sends (e.g. 2 seconds) to avoid spamming the HTTP API
      await new Promise(res => setTimeout(res, 2000));
    }

    // 4. Send Daily Admin Summary
    try {
      const adminEmail = process.env.EMAIL_USER || "adnan@mail.pakaiverse.com"; // Fallback to a known admin email
      
      const aiFailedLeads = await db.select({ id: leads.id }).from(leads).where(eq(leads.status, "ai-failed"));
      const aiFailedCount = aiFailedLeads.length;

      const summaryHtml = getAdminSummaryTemplate({
        sentCount,
        followUpScheduledCount,
        errors,
        aiFailedCount,
      });

      // This is sent independently via our standard email client and does NOT count towards the DB queue limits
      await sendEmail({
        to: adminEmail,
        subject: `PakAiVerse Daily Summary - ${sentCount} sent`,
        html: summaryHtml,
      });
    } catch (summaryErr) {
      console.error("Failed to send daily summary email:", summaryErr);
    }

    return NextResponse.json({ 
      success: true, 
      sent: sentCount, 
      errors: errors.length > 0 ? errors : undefined 
    });

  } catch (error: unknown) {
    console.error("Cron Job Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
