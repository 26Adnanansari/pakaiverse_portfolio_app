"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Monitor, Smartphone, ShoppingBag, LayoutDashboard, Briefcase, HeartPulse, Cpu, Wrench, Shirt } from "lucide-react";
import { waLink } from "@/config/portfolio";

interface LeadFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROJECT_TYPES = [
  { id: "webapp", label: "Web App", icon: Monitor },
  { id: "mobile", label: "Mobile App", icon: Smartphone },
  { id: "ecommerce", label: "E-Commerce", icon: ShoppingBag },
  { id: "saas", label: "SaaS Dashboard", icon: LayoutDashboard },
];

const INDUSTRIES = [
  { id: "fashion", label: "Fashion", icon: Shirt },
  { id: "finance", label: "Finance / Tax", icon: Briefcase },
  { id: "manufacturing", label: "Manufacturing", icon: Wrench },
  { id: "retail", label: "Food & Retail", icon: ShoppingBag },
  { id: "healthcare", label: "Healthcare", icon: HeartPulse },
  { id: "other", label: "Other Tech", icon: Cpu },
];

export default function LeadFunnelModal({ isOpen, onClose }: LeadFunnelModalProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    type: "",
    industry: "",
    name: "",
    email: "",
  });

  // Reset when opened
  if (!isOpen && step !== 1) {
    setTimeout(() => setStep(1), 300);
  }

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi Adnan! 👋\n\nName: ${data.name}\nEmail: ${data.email}\nProject: ${data.type}\nIndustry: ${data.industry}`;
    window.open(waLink(text), "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A2E] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <h3 className="font-display text-lg font-bold text-white">
                Start Your Project
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex h-1 w-full bg-white/5">
              <motion.div
                className="h-full bg-brand-primary"
                initial={{ width: "33%" }}
                animate={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 min-h-[360px]">
              <AnimatePresence mode="wait">
                {/* STEP 1: Project Type */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col h-full"
                  >
                    <h4 className="mb-6 text-xl font-medium text-white">
                      What are you looking to build?
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {PROJECT_TYPES.map((type) => {
                        const isSelected = data.type === type.label;
                        return (
                          <button
                            key={type.id}
                            onClick={() => {
                              setData({ ...data, type: type.label });
                              setTimeout(handleNext, 300);
                            }}
                            className={`flex flex-col items-center gap-3 rounded-xl border p-4 transition-all ${
                              isSelected
                                ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20"
                            }`}
                          >
                            <type.icon size={28} />
                            <span className="text-sm font-medium">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Industry */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col h-full"
                  >
                    <h4 className="mb-6 text-xl font-medium text-white">
                      Which industry is this for?
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {INDUSTRIES.map((ind) => {
                        const isSelected = data.industry === ind.label;
                        return (
                          <button
                            key={ind.id}
                            onClick={() => {
                              setData({ ...data, industry: ind.label });
                              setTimeout(handleNext, 300);
                            }}
                            className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
                              isSelected
                                ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20"
                            }`}
                          >
                            <ind.icon size={24} />
                            <span className="text-xs font-medium text-center">{ind.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Contact Info */}
                {step === 3 && (
                  <motion.form
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col h-full"
                  >
                    <h4 className="mb-6 text-xl font-medium text-white">
                      Just a few final details.
                    </h4>
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="modal-name" className="text-sm font-medium text-slate-300">Name</label>
                        <input
                          id="modal-name"
                          type="text"
                          required
                          value={data.name}
                          onChange={(e) => setData({ ...data, name: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-[#0A0A0F] px-4 py-3 text-white focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="modal-email" className="text-sm font-medium text-slate-300">Email</label>
                        <input
                          id="modal-email"
                          type="email"
                          required
                          value={data.email}
                          onChange={(e) => setData({ ...data, email: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-[#0A0A0F] px-4 py-3 text-white focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="mt-auto pt-8">
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-brand-primary px-6 py-4 font-bold text-black transition hover:bg-brand-primary/90 active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        Submit via WhatsApp <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between border-t border-white/5 px-6 py-4 bg-[#0A0A0F]/50">
              {step > 1 ? (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <span /> // spacer
              )}
              <span className="text-sm text-slate-500">Step {step} of 3</span>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
