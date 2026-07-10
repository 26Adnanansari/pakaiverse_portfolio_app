import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "@/components/admin/MobileNav";
import { HelpPanel } from "@/components/admin/HelpPanel";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Admin Navbar */}
      <header className="border-b border-white/10 bg-[#111118] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <MobileNav />
            <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
              <Image src="/projects/Main-logo.png" alt="PakAiVerse" fill className="object-contain" />
            </div>
            <div>
              <span className="font-bold text-white font-display">PakAiVerse</span>
              <span className="text-brand-primary font-bold"> Admin</span>
            </div>
          </div>

          {/* Nav Links — hidden on mobile, visible md+ */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <Link href="/admin" className="hover:text-white transition">Orders</Link>
            <Link href="/admin/leads" className="hover:text-white transition">Leads</Link>
            <Link href="/admin/projects" className="hover:text-white transition">Projects</Link>
            <Link href="/admin/emails" className="hover:text-white transition">Emails</Link>
            <Link href="/admin/blog" className="hover:text-white transition">Blog</Link>
            <Link href="/admin/settings" className="hover:text-white transition">Settings</Link>
          </nav>

          {/* User info + Logout */}
          <div className="flex items-center gap-3">
            {session.user?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full ring-2 ring-brand-primary/30" />
            )}
            <span className="hidden sm:block text-sm text-slate-300 max-w-[150px] truncate">{session.user?.name}</span>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/admin/login" }); }}>
              <button type="submit" className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-3 py-1.5 rounded-lg transition">
                Logout
              </button>
            </form>
            <Link href="/" className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-3 py-1.5 rounded-lg transition hidden sm:block">
              View Site
            </Link>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {children}
      </main>

      <HelpPanel />
    </div>
  );
}
