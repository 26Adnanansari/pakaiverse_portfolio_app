import { NextResponse } from "next/server";
import { db } from "@/db";
import { replies, leads } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const rows = await db
      .select({
        id: replies.id,
        leadId: replies.leadId,
        content: replies.content,
        sentiment: replies.sentiment,
        aiSuggestedResponse: replies.aiSuggestedResponse,
        status: replies.status,
        receivedAt: replies.receivedAt,
        leadName: leads.name,
        leadEmail: leads.email,
        leadProjectType: leads.projectType,
      })
      .from(replies)
      .leftJoin(leads, eq(replies.leadId, leads.id))
      .where(eq(replies.status, "pending"))
      .orderBy(desc(replies.receivedAt));

    const serialized = rows.map((r) => ({
      ...r,
      receivedAt: r.receivedAt ? r.receivedAt.toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({ success: true, replies: serialized });
  } catch (error) {
    console.error("Fetch replies error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, status, aiSuggestedResponse } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing reply id" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (aiSuggestedResponse !== undefined) updates.aiSuggestedResponse = aiSuggestedResponse;

    await db.update(replies).set(updates).where(eq(replies.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update reply error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
