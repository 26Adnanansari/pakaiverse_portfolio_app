import { RepliesClient } from "@/components/admin/RepliesClient";

export const metadata = {
  title: "Replies | Admin Dashboard",
};

export default function RepliesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Replies Inbox</h1>
        <p className="text-slate-400 text-sm mt-1">
          Prospect replies sorted by intent — interested replies appear first.
        </p>
      </div>

      <RepliesClient />
    </div>
  );
}
