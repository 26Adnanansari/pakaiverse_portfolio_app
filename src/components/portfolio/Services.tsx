"use client";

import { motion } from "framer-motion";
import { Globe, ShoppingCart, LayoutDashboard } from "lucide-react";

const SERVICES = [
  {
    icon: Globe,
    title: "Web Apps",
    desc: "Custom Next.js web applications built for speed, SEO, and flawless user experiences.",
    color: "text-brand-primary",
    bg: "bg-brand-primary/10",
    border: "group-hover:border-brand-primary/30",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce",
    desc: "Multi-vendor marketplaces and robust stores tailored for high conversion rates.",
    color: "text-brand-secondary",
    bg: "bg-brand-secondary/10",
    border: "group-hover:border-brand-secondary/30",
  },
  {
    icon: LayoutDashboard,
    title: "SaaS & Dashboards",
    desc: "Complex admin panels and SaaS platforms with intuitive data visualization.",
    color: "text-brand-accent",
    bg: "bg-brand-accent/10",
    border: "group-hover:border-brand-accent/30",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cardVariants: any = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Services() {
  return (
    <section className="section-pad relative z-10" id="services">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center md:mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            What I <span className="text-brand-primary">Build</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-3"
        >
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                className={`group glass-card rounded-2xl p-8 transition-colors duration-300 ${service.border}`}
              >
                <div className={`mb-6 inline-flex rounded-xl p-3 ${service.bg}`}>
                  <Icon size={28} className={service.color} />
                </div>
                <h3 className="mb-3 font-display text-xl font-bold text-white">
                  {service.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
