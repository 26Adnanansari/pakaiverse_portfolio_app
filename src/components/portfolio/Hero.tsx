"use client";

import { PORTFOLIO } from "@/config/portfolio";
import AnimatedTerminal from "./AnimatedTerminal";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const TRUST_POINTS = [
  "Starting from $100",
  "50+ Projects Delivered",
  "Clients in 🇺🇸 🇬🇧 🇨🇦 🇦🇺",
  "24hr Response Time",
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20" id="about">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-0 -translate-x-1/2 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 translate-x-1/2 w-96 h-96 bg-brand-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-page grid lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10">

        {/* Left Column — Text */}
        <div className="flex flex-col items-start gap-6 pt-10 lg:pt-0">
          {PORTFOLIO.availableForWork && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-1.5"
            >
              <div className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-primary"></span>
              </div>
              <span className="text-sm font-medium text-brand-primary">
                {PORTFOLIO.availabilityText}
              </span>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
          >
            Senior-Level Dev<br className="hidden sm:block" />
            <span className="gradient-text">Startup Prices.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-lg"
          >
            We build high-performance web apps, SaaS platforms & AI solutions for businesses in the USA, UK & Canada — at a fraction of local agency rates.
          </motion.p>

          {/* Trust points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap gap-x-5 gap-y-2"
          >
            {TRUST_POINTS.map((point) => (
              <span key={point} className="flex items-center gap-1.5 text-sm text-slate-300">
                <CheckCircle size={14} className="text-brand-primary flex-shrink-0" />
                {point}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mt-2"
          >
            <Link
              href="#contact"
              className="flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm sm:text-base font-semibold text-black transition hover:bg-brand-primary/90"
            >
              Get a Free Quote
              <ArrowRight size={18} />
            </Link>
            <Link
              href="#projects"
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm sm:text-base font-medium text-white transition hover:bg-white/10"
            >
              View Our Work
            </Link>
          </motion.div>
        </div>

        {/* Right Column — Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex justify-center lg:justify-end"
        >
          <AnimatedTerminal />
        </motion.div>

      </div>
    </section>
  );
}
