import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import BlogEditorClient from "./BlogEditorClient";

export const metadata = {
  title: "Blog Editor | PakAiVerse Admin",
};

export default async function AdminBlogEditorPage({ searchParams }: { searchParams: { slug?: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/admin/login");
  }

  let initialData = null;

  if (searchParams.slug) {
    const existing = await db.select().from(blogs).where(eq(blogs.slug, searchParams.slug)).limit(1);
    if (existing.length > 0) {
      initialData = existing[0];
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">{initialData ? 'Edit Blog Post' : 'Create New Post'}</h1>
      </div>
      
      <BlogEditorClient initialData={initialData} authorName={session.user.name || "Admin"} />
    </div>
  );
}
