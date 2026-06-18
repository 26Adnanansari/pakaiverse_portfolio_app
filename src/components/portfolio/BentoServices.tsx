"use client";

import { motion } from "framer-motion";
import { Code2, Server, Globe2, Sparkles, Rocket, Cpu, MonitorSmartphone } from "lucide-react";

export default function BentoServices() {
  return (
    <section className="section-pad relative z-10" id="services">
      <div className="container-page max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-4 py-1.5 font-mono text-xs tracking-widest text-brand-primary uppercase">
            <Sparkles size={12} /> Premium Capabilities
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mt-4">
            Everything you need to <br className="hidden sm:block" />
            <span className="text-slate-400">scale your business.</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">
          
          {/* Card 1: Core Focus (Spans 2 columns) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="md:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <MonitorSmartphone size={120} />
            </div>
            <div>
              <div className="h-12 w-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-6">
                <Code2 className="text-brand-primary" size={24} />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">Enterprise Web Applications</h3>
              <p className="text-slate-400 max-w-sm">
                From scalable SaaS platforms to custom enterprise dashboards, engineered with modern architectures for performance and reliability.
              </p>
            </div>
            <div className="flex gap-2 mt-4 relative z-10">
              {["React", "Next.js", "Tailwind"].map(tech => (
                <span key={tech} className="font-mono text-xs px-3 py-1 bg-white/5 rounded-full border border-white/10 text-slate-300">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Card 2: Performance */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
            className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative w-32 h-32 mb-4">
               <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                 <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10" />
                 <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset="5.6" className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] transition-all duration-1000 group-hover:stroke-emerald-300" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="font-display text-3xl font-bold text-white">99+</span>
               </div>
             </div>
             <h3 className="font-display font-semibold text-white">Lighthouse Score</h3>
             <p className="text-xs text-slate-400 mt-1">SEO & Performance</p>
          </motion.div>

          {/* Card 3: Backend & API */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
            className="glass-card rounded-3xl p-8 relative overflow-hidden group"
          >
             <div className="h-12 w-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center mb-6 relative z-10">
                <Server className="text-brand-secondary" size={24} />
             </div>
             <h3 className="font-display text-xl font-bold text-white mb-2 relative z-10">AI Integrations</h3>
             <p className="text-slate-400 text-sm relative z-10">
                Custom LLM integrations, autonomous agents, and smart data pipelines that accelerate business growth.
             </p>
             <div className="absolute bottom-[-20px] right-[-20px] text-brand-secondary/10 group-hover:text-brand-secondary/20 transition-colors z-0">
               <Cpu size={140} />
             </div>
          </motion.div>

          {/* Card 4: Global Reach (Spans 2 columns) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
            className="md:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden group flex items-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 flex-1">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <Globe2 className="text-blue-400" size={24} />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">E-Commerce & POS Scale</h3>
              <p className="text-slate-400 max-w-sm">
                Delivering massive multi-vendor marketplaces with unified Point of Sale systems. We engineer retail for the digital and physical world.
              </p>
            </div>

            <div className="hidden sm:flex relative z-10 w-40 h-40 items-center justify-center mr-8">
               <div className="absolute w-full h-full border border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
               <div className="absolute w-3/4 h-3/4 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
               <div className="absolute w-1/2 h-1/2 border border-blue-500/30 rounded-full animate-[spin_5s_linear_infinite]" style={{ boxShadow: '0 0 20px rgba(59,130,246,0.2)' }} />
               <Rocket className="text-white relative z-20 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" size={32} />
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
