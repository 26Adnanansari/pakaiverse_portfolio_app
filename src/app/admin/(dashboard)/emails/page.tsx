import { EmailsClient } from "@/components/admin/EmailsClient";
import { db } from "@/db";
import { emailQueue, leads } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Emails | Admin Dashboard",
};

export default async function EmailsPage() {
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

  const initialDrafts = draftsData.map(d => ({
    id: d.id.toString(),
    prospectName: d.prospectName || "Unknown",
    company: d.company || "Unknown",
    subject: d.subject,
    body: d.body,
    status: d.status,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Emails Management</h1>
        <p className="text-slate-400 text-sm mt-1">Review AI drafts or compose custom emails.</p>
      </div>

      <EmailsClient initialDrafts={initialDrafts} />
    </div>
  );
}
