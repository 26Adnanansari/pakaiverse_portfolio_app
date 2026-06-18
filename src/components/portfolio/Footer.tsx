import Link from "next/link";
import Image from "next/image";
import { PORTFOLIO } from "@/config/portfolio";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#0A0A0F] pt-16 pb-8 relative z-10">
      <div className="container-page max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 flex flex-col items-start gap-6">
            <Link href="/" className="hover:opacity-80 transition flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-md">
                <Image 
                  src="/projects/pakaiverse-logo-square.png" 
                  alt="PakAiVerse Logo" 
                  fill 
                  className="object-cover"
                />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                PakAiVerse<span className="text-brand-primary">.</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              A full-stack development agency building scalable web applications, SaaS platforms, and AI-powered solutions for global clients.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href={PORTFOLIO.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition bg-white/5 p-2 rounded-full hover:bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"/><path d="M9 18c-4.5 1.5-5-2.5-7-3"/></svg>
              </a>
              <a href={PORTFOLIO.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition bg-white/5 p-2 rounded-full hover:bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href={PORTFOLIO.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition bg-white/5 p-2 rounded-full hover:bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold mb-2">Services</h4>
            {["Web Development", "E-Commerce", "SaaS", "AI Integration", "Cloud"].map((item) => (
              <Link key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-slate-400 hover:text-brand-primary transition">{item}</Link>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold mb-2">Company</h4>
            {["About Us", "Careers", "Blog", "Press Kit"].map((item) => (
              <Link key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-slate-400 hover:text-brand-primary transition">{item}</Link>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold mb-2">Resources</h4>
            {["Documentation", "Case Studies", "FAQ", "Support"].map((item) => (
              <Link key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-slate-400 hover:text-brand-primary transition">{item}</Link>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold mb-2">Legal</h4>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <Link key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-slate-400 hover:text-brand-primary transition">{item}</Link>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {currentYear} PakAiVerse. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <p className="flex items-center gap-2">Founder & CEO: Adnan Ansari</p>
            <p className="hidden md:block">|</p>
            <a href={`mailto:${PORTFOLIO.email}`} className="hover:text-white transition">{PORTFOLIO.email}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
