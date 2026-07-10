import { RepliesClient } from "@/components/admin/RepliesClient";

export const metadata = {
  title: "Replies | PakAiVerse Admin",
};

export default function RepliesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Client Replies</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage incoming replies. AI pre-drafts a response for you.
          </p>
        </div>
      </div>

      <RepliesClient />
    </div>
  );
}
