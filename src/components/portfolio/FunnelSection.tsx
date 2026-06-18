"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  ShoppingBag,
  LayoutDashboard,
  Cpu,
  Lightbulb,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Zap,
  Clock,
  DollarSign,
  User,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { waLink } from "@/config/portfolio";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FunnelData {
  projectType: string;
  description: string;
  budget: string;
  timeline: string;
  name: string;
  whatsapp: string;
  email: string;
}

// ─── Step 1 Data ──────────────────────────────────────────────────────────────
const PROJECT_TYPES = [
  {
    id: "simple-app",
    label: "Simple App",
    sublabel: "Landing page, portfolio, small site",
    icon: Monitor,
    color: "from-cyan-500/20 to-blue-500/20",
    glow: "#00D4FF",
  },
  {
    id: "ecommerce",
    label: "E-Commerce Store",
    sublabel: "Online shop, product catalog, orders",
    icon: ShoppingBag,
    color: "from-emerald-500/20 to-teal-500/20",
    glow: "#10B981",
  },
  {
    id: "saas",
    label: "SaaS / Dashboard",
    sublabel: "Admin panel, analytics, subscriptions",
    icon: LayoutDashboard,
    color: "from-violet-500/20 to-purple-500/20",
    glow: "#7000FF",
  },
  {
    id: "complex",
    label: "Complex System",
    sublabel: "Multi-role, integrations, automation",
    icon: Cpu,
    color: "from-orange-500/20 to-red-500/20",
    glow: "#F97316",
  },
  {
    id: "problem",
    label: "I Have a Problem",
    sublabel: "Tell me — I'll find the solution",
    icon: Lightbulb,
    color: "from-yellow-500/20 to-amber-500/20",
    glow: "#EAB308",
  },
  {
    id: "other",
    label: "Not Sure Yet",
    sublabel: "Let's figure it out together",
    icon: HelpCircle,
    color: "from-slate-500/20 to-slate-400/20",
    glow: "#94A3B8",
  },
];

// ─── Step 2 Chips ─────────────────────────────────────────────────────────────
const SUGGESTION_CHIPS = [
  "Need an admin dashboard",
  "Want to sell products online",
  "Have a business idea",
  "Need to automate a process",
  "Existing site needs redesign",
  "Need a mobile-friendly app",
  "Build an MVP fast",
  "Something isn't working",
];

// ─── Step 3 Data ──────────────────────────────────────────────────────────────
const BUDGETS = [
  { id: "u500", label: "Under $500", sublabel: "Small / Quick" },
  { id: "500-2k", label: "$500 – $2,000", sublabel: "Standard" },
  { id: "2k-5k", label: "$2,000 – $5,000", sublabel: "Mid-range" },
  { id: "5kplus", label: "$5,000+", sublabel: "Enterprise" },
];

const TIMELINES = [
  { id: "asap", label: "ASAP", sublabel: "Rush project" },
  { id: "1month", label: "1 Month", sublabel: "Fast delivery" },
  { id: "2-3months", label: "2–3 Months", sublabel: "Standard" },
  { id: "flexible", label: "Flexible", sublabel: "No rush" },
];

// ─── Step Labels ──────────────────────────────────────────────────────────────
const STEPS = [
  { num: 1, label: "Project Type" },
  { num: 2, label: "Your Idea" },
  { num: 3, label: "Budget & Time" },
  { num: 4, label: "Contact" },
];

// ─── Variants ─────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const slideIn: any = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const slideBack: any = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: 40, transition: { duration: 0.25 } },
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FunnelSection() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<FunnelData>({
    projectType: "",
    description: "",
    budget: "",
    timeline: "",
    name: "",
    whatsapp: "",
    email: "",
  });

  // Ambient canvas blob animation
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      t += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cyan blob
      const cx1 = canvas.width * (0.3 + 0.1 * Math.sin(t));
      const cy1 = canvas.height * (0.3 + 0.08 * Math.cos(t * 0.7));
      const g1 = ctx.createRadialGradient(cx1, cy1, 0, cx1, cy1, canvas.width * 0.35);
      g1.addColorStop(0, "rgba(0,212,255,0.08)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Violet blob
      const cx2 = canvas.width * (0.7 + 0.08 * Math.cos(t * 0.8));
      const cy2 = canvas.height * (0.6 + 0.1 * Math.sin(t * 0.6));
      const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, canvas.width * 0.3);
      g2.addColorStop(0, "rgba(112,0,255,0.07)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const goNext = () => {
    setDirection("forward");
    setStep((s) => Math.min(s + 1, 4));
  };
  const goBack = () => {
    setDirection("back");
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      `Hi Adnan! 👋 I have a project inquiry.\n\n` +
      `*Project Type:* ${data.projectType}\n` +
      `*Description:* ${data.description}\n` +
      `*Budget:* ${data.budget}\n` +
      `*Timeline:* ${data.timeline}\n\n` +
      `*Name:* ${data.name}\n` +
      `*WhatsApp:* ${data.whatsapp}\n` +
      (data.email ? `*Email:* ${data.email}` : "");
    window.open(waLink(msg), "_blank");
    setSubmitted(true);
  };

  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;
  const variants = direction === "forward" ? slideIn : slideBack;

  return (
    <section
      id="start-project"
      className="section-pad relative overflow-hidden"
      style={{ background: "#0A0A0F" }}
    >
      {/* Ambient blob canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      />

      <div className="container-page relative z-10 max-w-3xl">
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 font-mono text-xs tracking-widest text-cyan-400 uppercase">
            <Sparkles size={12} /> Start Your Project
          </span>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Let&apos;s Build Something{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#00D4FF,#7000FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Amazing
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-400">
            From simple apps to complex solutions — share your idea with me
          </p>
        </motion.div>

        {/* ── Funnel Card ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
          style={{ boxShadow: "0 0 60px -20px rgba(0,212,255,0.12)" }}
        >
          {/* Progress Bar */}
          {!submitted && (
            <div className="px-6 pt-6">
              {/* Step labels */}
              <div className="mb-3 flex justify-between">
                {STEPS.map((s) => (
                  <span
                    key={s.num}
                    className="font-mono text-[10px] tracking-widest uppercase transition-colors"
                    style={{ color: step >= s.num ? "#00D4FF" : "#3C494E" }}
                  >
                    {s.label}
                  </span>
                ))}
              </div>
              {/* Track */}
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg,#7000FF,#00D4FF)",
                  }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
                {/* Spark tip */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-cyan-300"
                  style={{ boxShadow: "0 0 10px 3px #00D4FF" }}
                  animate={{ left: `calc(${progressPct}% - 6px)` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
              <div className="mt-2 text-right font-mono text-xs text-slate-500">
                Step {step} of {STEPS.length}
              </div>
            </div>
          )}

          {/* ── Step Content ─────────────────────────────────────────────── */}
          <div className="min-h-[420px] p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* ── SUCCESS ── */}
              {submitted && (
                <motion.div
                  key="success"
                  {...slideIn}
                  className="flex flex-col items-center justify-center gap-6 py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 size={64} className="text-cyan-400" style={{ filter: "drop-shadow(0 0 20px #00D4FF)" }} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white">Request Submitted! 🎉</h3>
                  <p className="max-w-sm text-slate-400">
                    Your inquiry has been sent via WhatsApp. I will connect with you shortly.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setStep(1); setData({ projectType: "", description: "", budget: "", timeline: "", name: "", whatsapp: "", email: "" }); }}
                    className="mt-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-6 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20"
                  >
                    Submit New Inquiry
                  </button>
                </motion.div>
              )}

              {/* ── STEP 1: Project Type ── */}
              {!submitted && step === 1 && (
                <motion.div key="step1" {...variants}>
                  <h3 className="mb-6 text-xl font-semibold text-white">
                    What are you looking to build?
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {PROJECT_TYPES.map((pt) => {
                      const selected = data.projectType === pt.label;
                      return (
                        <button
                          key={pt.id}
                          onClick={() => {
                            setData({ ...data, projectType: pt.label });
                            setTimeout(goNext, 250);
                          }}
                          className={`group relative flex flex-col items-start gap-2 overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 ${
                            selected
                              ? "border-cyan-400/60 bg-cyan-500/10"
                              : "border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                          }`}
                          style={selected ? { boxShadow: `0 0 20px -5px ${pt.glow}` } : {}}
                        >
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${pt.color}`}
                          >
                            <pt.icon size={20} className="text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{pt.label}</p>
                            <p className="text-[11px] leading-tight text-slate-500">{pt.sublabel}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Description ── */}
              {!submitted && step === 2 && (
                <motion.div key="step2" {...variants} className="flex flex-col gap-5">
                  <h3 className="text-xl font-semibold text-white">
                    Describe your idea or problem
                  </h3>
                  <textarea
                    rows={5}
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    placeholder="I need an app that... / My current challenge is..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                    style={{ minHeight: "120px" }}
                  />
                  {/* Quick chips */}
                  <div>
                    <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">
                      Or select from these:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTION_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          onClick={() =>
                            setData({
                              ...data,
                              description: data.description
                                ? data.description + " " + chip
                                : chip,
                            })
                          }
                          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-slate-300 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto flex justify-between">
                    <button onClick={goBack} className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      onClick={goNext}
                      disabled={!data.description.trim()}
                      className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-cyan-400 disabled:opacity-30"
                      style={{ boxShadow: data.description.trim() ? "0 0 20px -5px #00D4FF" : undefined }}
                    >
                      Next <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Budget & Timeline ── */}
              {!submitted && step === 3 && (
                <motion.div key="step3" {...variants} className="flex flex-col gap-6">
                  <h3 className="text-xl font-semibold text-white">Budget & Timeline</h3>

                  {/* Budget */}
                  <div>
                    <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-slate-500">
                      <DollarSign size={12} /> Budget Range
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {BUDGETS.map((b) => {
                        const sel = data.budget === b.label;
                        return (
                          <button
                            key={b.id}
                            onClick={() => setData({ ...data, budget: b.label })}
                            className={`flex flex-col items-center rounded-xl border py-3 text-center transition-all ${
                              sel
                                ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-300"
                                : "border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20 hover:bg-white/5"
                            }`}
                            style={sel ? { boxShadow: "0 0 16px -6px #00D4FF" } : {}}
                          >
                            <span className="text-sm font-bold">{b.label}</span>
                            <span className="font-mono text-[10px] text-slate-500">{b.sublabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-slate-500">
                      <Clock size={12} /> Timeline
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {TIMELINES.map((tl) => {
                        const sel = data.timeline === tl.label;
                        return (
                          <button
                            key={tl.id}
                            onClick={() => setData({ ...data, timeline: tl.label })}
                            className={`flex flex-col items-center rounded-xl border py-3 text-center transition-all ${
                              sel
                                ? "border-violet-400/60 bg-violet-500/10 text-violet-300"
                                : "border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20 hover:bg-white/5"
                            }`}
                            style={sel ? { boxShadow: "0 0 16px -6px #7000FF" } : {}}
                          >
                            <span className="text-sm font-bold">{tl.label}</span>
                            <span className="font-mono text-[10px] text-slate-500">{tl.sublabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button onClick={goBack} className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      onClick={goNext}
                      disabled={!data.budget || !data.timeline}
                      className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-cyan-400 disabled:opacity-30"
                      style={{ boxShadow: data.budget && data.timeline ? "0 0 20px -5px #00D4FF" : undefined }}
                    >
                      Next <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 4: Contact ── */}
              {!submitted && step === 4 && (
                <motion.form
                  key="step4"
                  {...variants}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5"
                >
                  <h3 className="text-xl font-semibold text-white">
                    Your Contact Details
                  </h3>

                  {/* Summary */}
                  <div className="flex flex-wrap gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    {[data.projectType, data.budget, data.timeline].filter(Boolean).map((val) => (
                      <span key={val} className="flex items-center gap-1 rounded-lg bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-400">
                        <Zap size={10} /> {val}
                      </span>
                    ))}
                  </div>

                  {/* Fields */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                        <User size={11} /> Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        placeholder="Your name"
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                        <Phone size={11} /> WhatsApp *
                      </label>
                      <input
                        required
                        type="tel"
                        value={data.whatsapp}
                        onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
                        placeholder="+92 xxx xxxxxxx"
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                      <Mail size={11} /> Email (optional)
                    </label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      placeholder="aap@example.com"
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                    />
                  </div>

                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={goBack} className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-3 text-sm font-bold text-black transition hover:bg-cyan-400"
                      style={{ boxShadow: "0 0 30px -5px #00D4FF" }}
                    >
                      <MessageSquare size={16} />
                      WhatsApp Pe Bhejein
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Social Proof ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-center"
        >
          {[
            { icon: CheckCircle2, text: "20+ Projects Delivered" },
            { icon: Zap, text: "Fast Turnaround" },
            { icon: Clock, text: "Reply Within Hours" },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-2 font-mono text-xs text-slate-500">
              <Icon size={14} className="text-cyan-500" />
              {text}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
