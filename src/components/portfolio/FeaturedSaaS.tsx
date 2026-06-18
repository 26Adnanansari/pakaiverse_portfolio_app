"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Barcode, LayoutDashboard, Store } from "lucide-react";

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

export default function FeaturedSaaS() {
  return (
    <section className="section-pad relative z-10 bg-brand-primary/5" id="flagship-saas">
      <div className="container-page">
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

        <div className="grid lg:grid-cols-2 gap-12 items-start relative pb-32">
          {/* Left: Content & Features */}
          <div className="sticky top-24 lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col gap-8"
            >
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="glass-card p-6 rounded-2xl hover:border-brand-primary/30 transition-colors">
                    <feature.icon className="w-8 h-8 text-brand-primary mb-4" />
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                <a
                  href="https://fashion.pakaiverse.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-brand-primary px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-white hover:scale-105"
                >
                  Visit Live Platform
                  <ArrowRight size={18} />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right: Sticky Image Showcase Stack */}
          <div className="flex flex-col gap-[20vh] sm:gap-[30vh] pt-12 lg:pt-0">
            {[1, 2, 3, 4, 5].map((num, idx) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="sticky top-24 lg:top-32 h-[400px] sm:h-[600px] w-full rounded-3xl overflow-hidden glass-card group border-brand-primary/20 shadow-2xl"
                style={{ top: `calc(6rem + ${idx * 1.5}rem)` }}
              >
                <Image
                  src={`/projects/fashion.pakaiverse.com${num}.png`}
                  alt={`Pakaiverse Fashion Dashboard ${num}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent opacity-80" />
                
                {/* Floating Tech Stack */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                  {["Vite", "TypeScript", "Tailwind CSS", "Neon DB"].map((tech) => (
                    <span key={tech} className="px-3 py-1 text-xs font-mono text-white/80 bg-[#0A0A0F]/50 backdrop-blur-md rounded-full border border-white/10">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
