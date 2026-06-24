"use client";

import { useState } from "react";
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProjectsListClient({ projects: initialProjects }: { projects: any[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting project");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/projects`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFeatured: !currentStatus }),
      });
      if (res.ok) {
        setProjects(projects.map(p => p.id === id ? { ...p, isFeatured: !currentStatus } : p));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (projects.length === 0) {
    return <p className="text-slate-400">No projects found. Add your first project!</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">
          <div className="relative h-48 w-full bg-[#111]">
            <Image 
              src={project.imageUrl || "/projects/placeholder.jpg"} 
              alt={project.name} 
              fill 
              className="object-cover"
            />
            {project.isFeatured && (
              <span className="absolute top-2 right-2 bg-brand-primary text-black text-[10px] font-bold px-2 py-1 rounded">
                FEATURED
              </span>
            )}
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-white font-bold text-lg mb-1">{project.name}</h3>
            <p className="text-slate-400 text-sm line-clamp-2 mb-4">{project.description}</p>
            
            <div className="mt-auto flex flex-wrap gap-2 mb-4">
              {project.techStack?.split(',').slice(0,3).map((tech: string, i: number) => (
                <span key={i} className="text-[10px] bg-white/10 text-slate-300 px-2 py-1 rounded">{tech.trim()}</span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-white">
                <input 
                  type="checkbox" 
                  checked={project.isFeatured}
                  onChange={() => handleToggleFeatured(project.id, project.isFeatured)}
                  className="rounded bg-black/50 border-white/20 text-brand-primary focus:ring-0"
                />
                Featured
              </label>
              <div className="flex items-center gap-3">
                {/* Edit could be implemented later, for now we can just delete and recreate to save time */}
                <button 
                  onClick={() => handleDelete(project.id)}
                  disabled={deletingId === project.id}
                  className="text-red-400 hover:text-red-300 text-xs font-semibold disabled:opacity-50"
                >
                  {deletingId === project.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
