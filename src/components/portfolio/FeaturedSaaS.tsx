"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ShoppingBag, Barcode, LayoutDashboard, Store, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const features = [
  {
    title: "Multi-Vendor Marketplace",
    description: "Shop creation, vendor management, and unified checkout system.",
    icon: Store,
  },
  {
    title: "Advanced Admin Dashboard",
    description: "Product CRUD, order tracking, and comprehensive analytics.",
    icon: LayoutDashboard,
  },
  {
    title: "Integrated POS System",
    description: "Point of Sale for physical stores directly connected to web inventory.",
    icon: ShoppingBag,
  },
  {
    title: "Mobile Barcode Scanning",
    description: "Auto-generate barcodes and scan via mobile camera for rapid checkout.",
    icon: Barcode,
  },
];

const screenshots = [
  { src: "/projects/fashion.pakaiverse.com1.png", label: "Vendor Dashboard" },
  { src: "/projects/fashion.pakaiverse.com2.png", label: "Product Management" },
  { src: "/projects/fashion.pakaiverse.com3.png", label: "POS System" },
  { src: "/projects/fashion.pakaiverse.com4.png", label: "Analytics & P&L" },
  { src: "/projects/fashion.pakaiverse.com5.png", label: "Mobile View" },
];

const techStack = ["Vite", "TypeScript", "Tailwind CSS", "Neon DB"];

export default function FeaturedSaaS() {
  const [activeIdx, setActiveIdx] = useState(0);

  const prev = () => setActiveIdx((i) => (i === 0 ? screenshots.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === screenshots.length - 1 ? 0 : i + 1));

  return (
    <section className="section-pad relative z-10 bg-brand-primary/5" id="flagship-saas">
      <div className="container-page">
        {/* Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-secondary/20 bg-brand-secondary/10 px-4 py-1.5 font-mono text-xs tracking-widest text-brand-secondary uppercase"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-secondary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-secondary"></span>
            </span>
            Flagship Case Study
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-6"
          >
            fashion.<span className="text-brand-primary">pakaiverse</span>.com
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg"
          >
            A massive, scalable e-commerce SaaS platform engineering the future of retail. We built a complete ecosystem empowering vendors with free shop creation and enterprise-grade tools.
          </motion.p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-8"
          >
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div key={idx} className="glass-card p-5 rounded-2xl hover:border-brand-primary/30 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-3 group-hover:bg-brand-primary/20 transition-colors">
                    <feature.icon className="w-5 h-5 text-brand-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span key={tech} className="px-3 py-1 text-xs font-mono text-brand-primary bg-brand-primary/10 border border-brand-primary/20 rounded-full">
                  {tech}
                </span>
              ))}
            </div>

            <a
              href="https://fashion.pakaiverse.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit flex items-center gap-2 rounded-full bg-brand-primary px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-white hover:scale-105"
            >
              Visit Live Platform
              <ExternalLink size={16} />
            </a>
          </motion.div>

          {/* Right: Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-4"
          >
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0d0d12] aspect-[16/10]">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 border-b border-white/5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                <div className="ml-3 flex-1 bg-white/5 rounded px-3 py-0.5 text-[10px] text-slate-500 font-mono truncate">
                  fashion.pakaiverse.com
                </div>
              </div>

              <div className="relative w-full" style={{ height: "calc(100% - 36px)" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIdx}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={screenshots[activeIdx].src}
                      alt={screenshots[activeIdx].label}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-top"
                      quality={90}
                      priority={activeIdx === 0}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between px-1">
              {/* Thumbnail tabs */}
              <div className="flex gap-2 flex-1 overflow-x-auto pb-1">
                {screenshots.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeIdx
                        ? "border-brand-primary shadow-lg shadow-brand-primary/20 scale-105"
                        : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                    style={{ width: 56, height: 36 }}
                    aria-label={s.label}
                  >
                    <Image
                      src={s.src}
                      alt={s.label}
                      fill
                      className="object-cover object-top"
                      sizes="56px"
                      quality={60}
                    />
                  </button>
                ))}
              </div>

              {/* Prev / Next */}
              <div className="flex gap-2 ml-4 flex-shrink-0">
                <button
                  onClick={prev}
                  className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
                  aria-label="Previous screenshot"
                >
                  <ChevronLeft size={16} className="text-white" />
                </button>
                <button
                  onClick={next}
                  className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
                  aria-label="Next screenshot"
                >
                  <ChevronRight size={16} className="text-white" />
                </button>
              </div>
            </div>

            {/* Active label */}
            <p className="text-center text-xs text-slate-500 font-mono">
              {screenshots[activeIdx].label} — {activeIdx + 1}/{screenshots.length}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
