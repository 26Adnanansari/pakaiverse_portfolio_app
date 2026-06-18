"use client";

import { motion } from "framer-motion";

import { PORTFOLIO } from "@/config/portfolio";
import { Bot } from "lucide-react";

export default function AboutFounder() {
  return (
    <section className="section-pad relative z-10" id="about-founder">
      <div className="container-page max-w-5xl">
        <div className="mb-12 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-4 py-1.5 font-mono text-xs tracking-widest text-brand-primary uppercase"
          >
            Leadership & Vision
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl font-bold text-white"
          >
            The Team Behind The Tech
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Adnan Profile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="glass-card rounded-3xl p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-1">Adnan Ansari</h3>
              <p className="text-brand-primary font-mono text-sm mb-6">Founder & Lead Engineer</p>
              
              <p className="text-slate-400 mb-8 leading-relaxed">
                As a full-stack architect, I bridge the gap between complex business requirements and scalable technical solutions. With deep expertise in Next.js, modern cloud infrastructure, and AI integration, I ensure every product we build at PakAiVerse is engineered for growth.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {["Next.js", "System Architecture", "AI Integration", "Cloud DevOps"].map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs font-mono text-slate-300 bg-white/5 rounded-full border border-white/10">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <a href={PORTFOLIO.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"/><path d="M9 18c-4.5 1.5-5-2.5-7-3"/></svg>
                </a>
                <a href={PORTFOLIO.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a href={PORTFOLIO.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
              </div>
            </div>
          </motion.div>

          {/* AI Agents Profile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="glass-card rounded-3xl p-8 relative overflow-hidden group border-brand-secondary/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-brand-secondary">
              <Bot size={100} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-bold text-white">AI Agents</h3>
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>
              <p className="text-brand-secondary font-mono text-sm mb-6">Autonomous Development Team</p>
              
              <p className="text-slate-400 mb-8 leading-relaxed">
                We leverage proprietary AI agents to accelerate our development pipeline. From rapid code generation and architecture blueprints to automated testing and deployment, our AI partnership allows us to deliver enterprise-grade software at unprecedented speeds.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {["Code Generation", "Auto-Testing", "CI/CD Pipelines", "Data Modeling"].map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs font-mono text-slate-300 bg-white/5 rounded-full border border-white/10">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
