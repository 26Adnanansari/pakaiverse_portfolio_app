import { NextResponse } from "next/server";
import { db } from "@/db";
import { emailQueue, leads } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const draftsData = await db
      .select({
        id: emailQueue.id,
        leadId: emailQueue.leadId,
        subject: emailQueue.subject,
        body: emailQueue.body,
        status: emailQueue.status,
        prospectName: leads.name,
        company: leads.name,
        leadEmail: leads.email,
      })
      .from(emailQueue)
      .leftJoin(leads, eq(emailQueue.leadId, leads.id))
      .where(eq(emailQueue.status, "pending"))
      .orderBy(desc(emailQueue.createdAt));

    const drafts = draftsData.map(d => ({
      id: d.id.toString(),
      prospectName: d.prospectName || "Unknown",
      company: d.company || "Unknown",
      subject: d.subject,
      body: d.body,
      status: d.status || "pending",
    }));

    return NextResponse.json({ success: true, drafts });
  } catch (error) {
    console.error("Email drafts fetch error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
