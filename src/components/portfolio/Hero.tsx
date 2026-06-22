"use client";

import { PORTFOLIO } from "@/config/portfolio";
import AnimatedTerminal from "./AnimatedTerminal";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
            We Build Products That <br className="hidden sm:block" />
            <span className="gradient-text">Scale.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-lg"
          >
            {PORTFOLIO.name} is a full-stack development agency specializing in high-performance web applications, SaaS platforms, and AI-powered solutions.
            <span className="block mt-4 text-sm text-slate-500 border-l-2 border-brand-primary/50 pl-4 py-1">
              <strong>Client Portal:</strong> We use Google Sign-In to securely give you access to track your orders, upload payment proofs, and manage your active projects seamlessly.
            </span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mt-2"
          >
            <Link
              href="#projects"
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm sm:text-base font-semibold text-black transition hover:bg-slate-200"
            >
              Start Your Project
              <ArrowRight size={18} />
            </Link>
            <Link
              href="#contact"
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
