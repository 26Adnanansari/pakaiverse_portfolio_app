"use client";

import { useState } from "react";
import { deleteBlog } from "./actions";

export default function DeleteBlogButton({ id, title }: { id: number; title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the post "${title}"?`)) {
      setIsDeleting(true);
      const res = await deleteBlog(id);
      if (!res.success) {
        alert("Failed to delete: " + res.error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-red-400 hover:text-red-300 px-2 py-1 text-xs bg-red-500/10 rounded disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
