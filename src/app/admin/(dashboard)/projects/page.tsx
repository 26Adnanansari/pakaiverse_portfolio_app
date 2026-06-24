import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc } from "drizzle-orm";
import ProjectsListClient from "./ProjectsListClient";

export const metadata = {
  title: "Projects Manager | PakAiVerse Admin",
};

export const revalidate = 0;

export default async function AdminProjectsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/admin/login");
  }

  const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt));

  const serializedProjects = allProjects.map((p) => ({
    ...p,
    createdAt: p.createdAt ? p.createdAt.toISOString() : null,
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Projects Manager</h1>
        <a 
          href="/admin/projects/new" 
          className="bg-brand-primary text-black px-4 py-2 rounded-lg font-bold hover:bg-white transition"
        >
          Create New Project
        </a>
      </div>
      
      <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden p-6">
        <ProjectsListClient projects={serializedProjects} />
      </div>
    </div>
  );
}
