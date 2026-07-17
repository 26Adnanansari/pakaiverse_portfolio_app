"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

type Mode = "login" | "forgot" | "reset";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");

  const [mode, setMode] = useState<Mode>(resetToken ? "reset" : "login");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── Login handler ──────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const result = await signIn("credentials", {
      email, password,
      callbackUrl: "/admin",
      redirect: false,
    });
    setLoading(false);
    if (result?.error) setError("Invalid email or password. Please try again.");
    else if (result?.url) window.location.href = result.url;
  };

  // ── Forgot Password handler ────────────────────────
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSuccess("If that email is registered, a reset link has been sent.");
  };

  // ── Reset Password handler ─────────────────────────
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError(""); setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: resetToken, password: newPassword }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setSuccess(`Done! Copy this hash into your .env.local as ADMIN_PASSWORD_HASH:\n\n${data.newHash}`);
    } else {
      setError(data.error || "Link expired. Please request a new one.");
    }
  };

  return (
    <>
      {/* ─── LOGIN MODE ─────────────────────────── */}
      {mode === "login" && (
        <>
          <h2 className="text-xl font-bold text-white mb-1">Sign In</h2>
          <p className="text-slate-400 text-sm mb-6">Enter your admin credentials to continue.</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-5 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-300">Email</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-brand-primary outline-none transition"
                placeholder="admin@yoursite.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm text-slate-300">Password</label>
                <button type="button" onClick={() => setMode("forgot")} className="text-xs text-brand-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-slate-500 focus:border-brand-primary outline-none transition"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="mt-2 w-full bg-brand-primary text-black font-bold py-3.5 rounded-xl transition hover:bg-brand-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-500">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button onClick={() => signIn("google", { callbackUrl: "/client/dashboard" })}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold px-6 py-3.5 rounded-xl transition hover:bg-gray-100 active:scale-[0.98]">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </>
      )}

      {/* ─── FORGOT MODE ────────────────────────── */}
      {mode === "forgot" && (
        <>
          <h2 className="text-xl font-bold text-white mb-1">Reset Password</h2>
          <p className="text-slate-400 text-sm mb-6">Enter your admin email to receive a reset link.</p>

          {success ? (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-4 text-sm">{success}</div>
          ) : (
            <form onSubmit={handleForgot} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-slate-300">Admin Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-brand-primary outline-none transition"
                  placeholder="admin@yoursite.com" />
              </div>
              <button type="submit" disabled={loading}
                className="mt-2 w-full bg-brand-primary text-black font-bold py-3.5 rounded-xl transition hover:bg-brand-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}
          <button onClick={() => { setMode("login"); setSuccess(""); }} className="mt-5 text-sm text-slate-400 hover:text-white transition">
            ← Back to login
          </button>
        </>
      )}

      {/* ─── RESET MODE ─────────────────────────── */}
      {mode === "reset" && (
        <>
          <h2 className="text-xl font-bold text-white mb-1">New Password</h2>
          <p className="text-slate-400 text-sm mb-6">Enter your new password below.</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-5 text-sm">
              <AlertCircle size={16} />  {error}
            </div>
          )}

          {success ? (
            <div className="bg-[#0a1a0a] border border-green-500/30 text-green-400 rounded-xl px-4 py-4 text-xs whitespace-pre-wrap break-all">{success}</div>
          ) : (
            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-slate-300">New Password</label>
                <div className="relative">
                  <input type={showNewPassword ? "text" : "password"} required value={newPassword}
                    onChange={e => setNewPassword(e.target.value)} minLength={8}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-slate-500 focus:border-brand-primary outline-none transition"
                    placeholder="Min. 8 characters" />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition">
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="mt-2 w-full bg-brand-primary text-black font-bold py-3.5 rounded-xl transition hover:bg-brand-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Updating..." : "Set New Password"}
              </button>
            </form>
          )}
        </>
      )}
    </>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4">
      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-primary/5 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-3">
            <Image src="/projects/Main-logo.png" alt="PakAiVerse" fill className="object-contain" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white">
            PakAiVerse <span className="text-brand-primary">Admin</span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Authorized access only</p>
        </div>

        <div className="bg-[#111118] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand-primary" /></div>}>
            <AdminLoginForm />
          </Suspense>
        </div>

        <p className="text-center mt-5 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">← Back to PakAiVerse</Link>
        </p>
      </div>
    </div>
  );
}
