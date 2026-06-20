import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import DeleteBlogButton from "./DeleteBlogButton";

export const metadata = {
  title: "Blog Manager | PakAiVerse Admin",
};

export default async function AdminBlogPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/admin/login");
  }

  const allBlogs = await db.select().from(blogs).orderBy(desc(blogs.createdAt));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Blog Manager</h1>
        <Link 
          href="/admin/blog/new" 
          className="bg-brand-primary text-black px-4 py-2 rounded-lg font-bold hover:bg-white transition"
        >
          Create New Post
        </Link>
      </div>
      
      <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Title & Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-4">
                    <div className="font-bold text-white text-base">{blog.title}</div>
                    <div className="text-xs text-brand-secondary">/{blog.slug}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs rounded border ${blog.published ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-400">{blog.author}</td>
                  <td className="px-4 py-4 text-xs text-slate-400">
                    {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-4 text-right flex items-center justify-end gap-2">
                    <Link href={`/admin/blog/new?slug=${blog.slug}`} className="text-blue-400 hover:text-blue-300 px-2 py-1 text-xs bg-blue-500/10 rounded">
                      Edit
                    </Link>
                    <DeleteBlogButton id={blog.id} title={blog.title} />
                  </td>
                </tr>
              ))}
              {allBlogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No blog posts found. Create one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
