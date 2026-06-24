"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    liveUrl: "",
    githubUrl: "",
    techStack: "",
    category: "",
    isFeatured: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/projects");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create project");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Project Name *</label>
          <input 
            type="text" 
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-primary/50 transition-colors"
            placeholder="e.g. Zamzam Press App"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Category</label>
          <input 
            type="text" 
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-primary/50 transition-colors"
            placeholder="e.g. SaaS, E-commerce, Mobile App"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Short Description *</label>
        <textarea 
          name="description"
          required
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-primary/50 transition-colors"
          placeholder="Briefly describe what this project is about..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Image URL *</label>
        <input 
          type="text" 
          name="imageUrl"
          required
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-primary/50 transition-colors"
          placeholder="e.g. /projects/my-app.png or https://example.com/img.jpg"
        />
        <p className="text-[10px] text-slate-500">Put image in the public/projects folder and write the path like: /projects/filename.png</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Live Website URL</label>
          <input 
            type="text" 
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleChange}
            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-primary/50 transition-colors"
            placeholder="https://yourproject.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Tech Stack</label>
          <input 
            type="text" 
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-primary/50 transition-colors"
            placeholder="Next.js, Tailwind, Drizzle (Comma separated)"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
            className="w-5 h-5 rounded border-white/10 bg-[#111] text-brand-primary focus:ring-brand-primary/50 focus:ring-offset-0"
          />
          <span className="text-white font-medium text-sm">Mark as Featured (shows on top)</span>
        </label>

        <div className="flex space-x-4">
          <button 
            type="button"
            onClick={() => router.push("/admin/projects")}
            className="px-6 py-2 rounded-lg text-slate-300 hover:text-white transition-colors text-sm"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-brand-primary text-black font-bold hover:bg-white transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? "Saving..." : "Create Project"}
          </button>
        </div>
      </div>
    </form>
  );
}
