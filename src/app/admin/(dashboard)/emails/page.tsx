import { EmailsClient } from "@/components/admin/EmailsClient";

export const metadata = {
  title: "Emails | Admin Dashboard",
};

export default function EmailsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Emails Management</h1>
        <p className="text-slate-400 text-sm mt-1">Review AI drafts or compose custom emails.</p>
      </div>

      <EmailsClient />
    </div>
  );
}
