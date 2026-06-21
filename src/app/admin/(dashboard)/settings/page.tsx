import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import AdminSettingsClient from "./AdminSettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [bankDetailsSetting] = await db.select().from(settings).where(eq(settings.id, "bankDetails"));
  const initialBankDetails = bankDetailsSetting?.value || "";

  return (
    <div className="bg-[#111118] border border-white/10 rounded-2xl p-4 sm:p-6 max-w-3xl">
      <h2 className="text-xl font-bold mb-6">Platform Settings</h2>
      <AdminSettingsClient initialBankDetails={initialBankDetails} />
    </div>
  );
}
