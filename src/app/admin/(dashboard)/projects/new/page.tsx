import { redirect } from "next/navigation";
import { auth } from "@/auth";
import NewProjectClient from "./NewProjectClient";

export const metadata = {
  title: "Create Project | PakAiVerse Admin",
};

export default async function NewProjectPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/admin/login");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Create New Project</h1>
        <p className="text-slate-400 text-sm">Add a new app or portfolio piece to the main website.</p>
      </div>
      
      <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden p-6 max-w-3xl">
        <NewProjectClient />
      </div>
    </div>
  );
}
