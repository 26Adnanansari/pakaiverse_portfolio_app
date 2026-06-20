import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { desc } from "drizzle-orm";
import LeadsClient from "./LeadsClient";

export const metadata = {
  title: "Leads Manager | PakAiVerse Admin",
};

export default async function AdminLeadsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/admin/login");
  }

  const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));

  // Serialize dates for client component
  const serializedLeads = allLeads.map((lead) => ({
    ...lead,
    createdAt: lead.createdAt ? lead.createdAt.toISOString() : null,
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Leads Manager</h1>
      </div>
      
      <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden">
        <LeadsClient leads={serializedLeads} />
      </div>
    </div>
  );
}
