"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { saveBlog } from "../actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlogEditorClient({ initialData, authorName }: { initialData: any, authorName: string }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [published, setPublished] = useState(initialData?.published || false);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-generate slug from title if it's a new post
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!initialData) {
      setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleSave = async () => {
    if (!title || !slug || !content) {
      alert("Title, Slug, and Content are required.");
      return;
    }

    setIsSaving(true);
    const res = await saveBlog({
      title,
      slug,
      coverImage,
      content,
      published,
      author: authorName,
    });

    setIsSaving(false);

    if (res.success) {
      router.push("/admin/blog");
    } else {
      alert("Failed to save: " + res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Title</label>
          <input 
            type="text" 
            value={title}
            onChange={handleTitleChange}
            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-primary/50 transition-colors"
            placeholder="Enter post title"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Slug (URL)</label>
          <input 
            type="text" 
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={!!initialData}
            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white outline-none disabled:opacity-50"
            placeholder="enter-post-slug"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Cover Image URL (Optional)</label>
        <input 
          type="text" 
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-primary/50 transition-colors"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Content</label>
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-5 h-5 rounded border-white/10 bg-[#111] text-brand-primary focus:ring-brand-primary/50 focus:ring-offset-0"
          />
          <span className="text-white font-medium">Publish immediately</span>
        </label>

        <div className="flex space-x-4">
          <button 
            type="button"
            onClick={() => router.push("/admin/blog")}
            className="px-6 py-2 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 rounded-lg bg-brand-primary text-black font-bold hover:bg-white transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
