"use client";

import { motion } from "framer-motion";
import { Lightbulb, PenTool, Code, CheckCircle, Rocket, BrainCircuit } from "lucide-react";

const PROCESS_STEPS = [
  {
    icon: Lightbulb,
    title: "Discovery",
    desc: "Understanding your business goals, target audience, and enterprise requirements.",
  },
  {
    icon: BrainCircuit,
    title: "AI Strategy",
    desc: "Identifying opportunities for automation and AI integration to scale operations.",
  },
  {
    icon: PenTool,
    title: "UI/UX Design",
    desc: "Crafting intuitive interfaces with modern aesthetics and interactive prototypes.",
  },
  {
    icon: Code,
    title: "Development",
    desc: "Building scalable cloud architectures and robust Next.js applications.",
  },
  {
    icon: CheckCircle,
    title: "QA & Testing",
    desc: "Ensuring flawless performance, security audits, and strict quality assurance.",
  },
  {
    icon: Rocket,
    title: "Launch",
    desc: "Deploying to production edge networks and setting up continuous monitoring.",
  },
];

export default function ProcessTimeline() {
  return (
    <section className="section-pad relative z-10" id="process">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            How <span className="gradient-text">We Work</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="absolute top-10 left-0 hidden h-[2px] w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent opacity-20 md:block" />

          {/* Connector Line (Mobile) */}
          <div className="absolute top-0 bottom-0 left-6 block w-[2px] bg-gradient-to-b from-brand-primary via-brand-secondary to-brand-accent opacity-20 md:hidden" />

          <div className="grid gap-12 md:grid-cols-6 md:gap-4">
            {PROCESS_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="relative flex flex-col items-start pl-16 md:items-center md:pl-0 md:text-center"
                >
                  {/* Step Number / Icon Circle */}
                  <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-brand-surface border border-white/10 text-brand-primary shadow-[0_0_15px_rgba(0,212,255,0.15)] md:relative md:mb-6 md:h-20 md:w-20 z-10">
                    <Icon className="h-5 w-5 md:h-8 md:w-8" />
                  </div>

                  <h3 className="mb-2 font-display text-lg font-bold text-white md:text-xl mt-1 md:mt-0">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-[250px]">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
