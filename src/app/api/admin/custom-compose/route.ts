import { NextResponse } from "next/server";
import { db } from "@/db";
import { emailQueue } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

// POST: Create a custom compose draft
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { subject, body, recipientEmail } = await request.json();

    if (!subject || !body) {
      return NextResponse.json({ success: false, error: "Subject and body are required" }, { status: 400 });
    }
    if (!recipientEmail) {
      return NextResponse.json({ success: false, error: "Recipient email is required" }, { status: 400 });
    }

    // Custom compose emails go into emailQueue as pending (admin approves to send)
    const inserted = await db.insert(emailQueue).values({
      leadId: null,
      subject: subject.trim(),
      body: body.trim(),
      scheduledAt: new Date(),
      status: "pending",
    }).returning({ id: emailQueue.id });

    return NextResponse.json({
      success: true,
      id: inserted[0].id.toString(),
      message: "Draft saved. Go to AI Drafts tab to review and approve.",
    });
  } catch (error) {
    console.error("Custom compose error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// PATCH: Edit an existing draft's subject/body
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, subject, body } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing draft id" }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (subject) updates.subject = subject.trim();
    if (body) updates.body = body.trim();

    await db.update(emailQueue).set(updates).where(eq(emailQueue.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Edit draft error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
