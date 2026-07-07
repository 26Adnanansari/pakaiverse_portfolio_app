"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/admin", label: "Orders" },
    { href: "/admin/leads", label: "Leads" },
    { href: "/admin/projects", label: "Projects" },
    { href: "/admin/emails", label: "Emails" },
    { href: "/admin/blog", label: "Blog" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <>
      <button 
        className="md:hidden p-2 -ml-2 text-slate-300 hover:text-white transition"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-[#111118] border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <span className="font-bold text-white font-display">Menu</span>
          <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition"
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-white/10 my-2" />
          <Link 
            href="/"
            onClick={() => setIsOpen(false)}
            className="text-slate-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition"
          >
            View Site
          </Link>
        </nav>
      </div>
    </>
  );
}
