import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads, emailQueue } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { sendEmail } from "@/lib/email";
import { getBaseEmailTemplate } from "@/lib/email-templates";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { emailQueueId } = await request.json();

    if (!emailQueueId) {
      return NextResponse.json({ success: false, error: "emailQueueId is required" }, { status: 400 });
    }

    // Fetch the queued email + lead details
    const [item] = await db
      .select({
        id: emailQueue.id,
        leadId: emailQueue.leadId,
        subject: emailQueue.subject,
        body: emailQueue.body,
        leadEmail: leads.email,
        leadName: leads.name,
        leadFollowUpCount: leads.followUpCount,
        leadSuppressed: leads.suppressList,
      })
      .from(emailQueue)
      .leftJoin(leads, eq(emailQueue.leadId, leads.id))
      .where(eq(emailQueue.id, Number(emailQueueId)));

    if (!item) {
      return NextResponse.json({ success: false, error: "Email draft not found" }, { status: 404 });
    }

    if (!item.leadEmail || item.leadSuppressed) {
      return NextResponse.json({ success: false, error: "Lead is suppressed or has no email" }, { status: 400 });
    }

    // Wrap body in professional HTML template
    const wrappedHtml = getBaseEmailTemplate({
      content: item.body.replace(/\n/g, "<br>"),
      companyName: "PakAiVerse",
      leadId: item.leadId?.toString(),
    });

    // Send immediately via Resend
    const sendResult = await sendEmail({
      to: item.leadEmail,
      subject: item.subject,
      html: wrappedHtml,
    });

    const success = !!(sendResult.id || sendResult.success);

    if (!success) {
      // Mark as failed
      await db.update(emailQueue)
        .set({ status: "failed", errorLog: sendResult.error || "Unknown send error", updatedAt: new Date() })
        .where(eq(emailQueue.id, item.id));

      return NextResponse.json({ success: false, error: "Failed to send email via Resend" }, { status: 500 });
    }

    // Mark queue entry as sent
    await db.update(emailQueue)
      .set({ status: "sent", updatedAt: new Date() })
      .where(eq(emailQueue.id, item.id));

    // Update lead status
    const newFollowUpCount = (item.leadFollowUpCount || 0) + 1;
    await db.update(leads)
      .set({ status: "contacted", followUpCount: newFollowUpCount, lastEmailedAt: new Date() })
      .where(eq(leads.id, item.leadId!));

    return NextResponse.json({
      success: true,
      message: `Email sent to ${item.leadEmail}`,
    });

  } catch (error) {
    console.error("Approve email error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
