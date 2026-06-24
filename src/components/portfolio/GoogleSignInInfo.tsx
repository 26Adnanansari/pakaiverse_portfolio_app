import Link from "next/link";
import { ShieldCheck, UserCheck, LayoutDashboard, FileCheck } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Google Login",
    desc: "We use Google OAuth 2.0 — the industry standard. No separate password needed. Your Google account keeps your data safe.",
  },
  {
    icon: UserCheck,
    title: "Client Identity Verification",
    desc: "Google Sign-In uniquely identifies each client, ensuring only you can access your private project dashboard.",
  },
  {
    icon: LayoutDashboard,
    title: "Project Dashboard Access",
    desc: "Track your order status, view deliverables, and communicate with our team — all in one private client portal.",
  },
  {
    icon: FileCheck,
    title: "Payment Proof Upload",
    desc: "Easily upload payment screenshots directly from your dashboard after placing a guest post or web development order.",
  },
];

export default function GoogleSignInInfo() {
  return (
    <section
      id="client-portal-info"
      className="relative z-10 py-20 overflow-hidden"
      aria-label="Client Portal and Google Sign-In information"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-page relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-4 py-1.5 text-xs font-mono tracking-widest text-brand-primary uppercase mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-primary"></span>
            </span>
            Secure Client Portal
          </span>

          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Why We Use{" "}
            <span className="gradient-text">Google Sign-In</span>
          </h2>

          <p className="text-slate-400 text-lg leading-relaxed">
            PakAiVerse provides every client with a private, secure dashboard to manage their projects.
            We use <strong className="text-white">Google OAuth 2.0</strong> — not to access your Google account data —
            but simply to verify your identity and give you a passwordless, secure login to your Client Portal.
            We only request your <strong className="text-white">name and email</strong>.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="glass-card rounded-2xl p-6 flex flex-col gap-4 hover:border-brand-primary/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                <Icon className="w-6 h-6 text-brand-primary" aria-hidden="true" />
              </div>
              <h3 className="text-white font-semibold text-base">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6 rounded-2xl border border-brand-primary/20 bg-brand-primary/5 max-w-2xl mx-auto">
          <div className="flex-1 text-center sm:text-left">
            <p className="text-white font-semibold">Already a client?</p>
            <p className="text-slate-400 text-sm mt-1">Sign in with Google to access your private project dashboard.</p>
          </div>
          <Link
            href="/client/dashboard"
            className="flex-shrink-0 flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-slate-100 hover:scale-105"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Access Client Portal
          </Link>
        </div>
      </div>
    </section>
  );
}
