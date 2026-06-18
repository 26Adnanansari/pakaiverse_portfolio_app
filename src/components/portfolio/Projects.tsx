"use client";

import { motion, Variants } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const PROJECTS = [
  {
    name: "Special Children Institute",
    url: "https://special-children-educational-instit.vercel.app",
    desc: "NGO educational app for special children — progress tracking, resources & parent portal.",
    stack: ["Next.js", "Vercel", "Tailwind"],
    type: "NGO App",
    image: "/projects/Special children educational institue app.png",
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    name: "Bushra's Collections",
    url: "https://bushrascollections.com",
    desc: "Ladies fashion brand — product listings, collections & order management.",
    stack: ["Next.js", "Stripe", "PostgreSQL"],
    type: "Fashion Brand",
    image: "/projects/bushrascollections.com.png",
    color: "from-pink-500/20 to-rose-500/20",
  },
  {
    name: "ZamZam Press",
    url: "https://zamzam-prress-app.vercel.app",
    desc: "B2B product catalog & order portal for paper bag manufacturer.",
    stack: ["Next.js", "Framer Motion", "Tailwind"],
    type: "B2B Catalog",
    image: "/projects/zamzam press , paper bag product.png",
    color: "from-amber-500/20 to-yellow-500/20",
  },

  {
    name: "Ammar Publish",
    url: "https://ammarpublish.vercel.app",
    desc: "Publishing web app with full admin dashboard and backend management.",
    stack: ["Next.js", "Admin Dashboard", "Vercel"],
    type: "SaaS App",
    image: "/projects/Ammar Publisher app.png",
    color: "from-violet-500/20 to-purple-500/20",
  },
  {
    name: "Perahan",
    url: "https://perahan.vercel.app",
    desc: "A traditional dress designer boutique platform with collections.",
    stack: ["Next.js", "Tailwind", "Vercel"],
    type: "Boutique E-commerce",
    image: "/projects/Perahan a traditional dress designer boutique.png",
    color: "from-brand-secondary/20 to-purple-500/20",
  },
  {
    name: "ProTax US Solutions",
    url: "https://usta-xweb.vercel.app",
    desc: "IRS-registered tax prep SaaS platform for global clients.",
    stack: ["React", "Node.js", "Tailwind"],
    type: "SaaS",
    image: "/projects/ProTax US Solutions.png",
    color: "from-brand-accent/20 to-orange-500/20",
  },
  {
    name: "Kami Foods",
    url: "https://kami-foods.vercel.app",
    desc: "Restaurant app featuring banners, table reservation, and food ordering.",
    stack: ["Next.js", "Node.js", "Tailwind"],
    type: "Restaurant App",
    image: "/projects/Resturant app.png",
    color: "from-red-500/20 to-orange-500/20",
  }
];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cardVariants: any = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Projects() {
  return (
    <section className="section-pad relative z-10" id="projects">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Our Elite <br />
            <span className="text-slate-400">Portfolio.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-2 lg:gap-8"
        >
          {PROJECTS.map((project, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="group glass-card overflow-hidden rounded-2xl flex flex-col h-full"
            >
              {/* Browser Chrome Header */}
              <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-slate-600/50" />
                  <div className="h-3 w-3 rounded-full bg-slate-600/50" />
                  <div className="h-3 w-3 rounded-full bg-slate-600/50" />
                </div>
                <div className="ml-2 flex-1 rounded bg-black/20 px-2 py-1 text-center text-xs text-slate-500 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                  {project.url.replace("https://", "")}
                </div>
              </div>

              {/* Image Area */}
              <div
                className={`relative h-48 sm:h-56 w-full bg-gradient-to-br ${project.color} flex items-center justify-center overflow-hidden`}
              >
                {project.image ? (
                  <Image 
                    src={project.image} 
                    alt={project.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-40"
                  />
                ) : (
                  <span className="font-display text-2xl font-bold text-white/50 tracking-wider uppercase opacity-50 mix-blend-overlay">
                    {project.name}
                  </span>
                )}
                
                {/* Overlay link icon on hover */}
                <div className="absolute inset-0 bg-brand-bg/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm z-10">
                   <Link href={project.url} target="_blank" className="btn-primary rounded-full px-6 py-3 shadow-xl glow-primary">
                      Visit Live <ExternalLink size={16} className="ml-2" />
                   </Link>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                    {project.name}
                    {project.type && (
                       <span className="text-[10px] uppercase tracking-widest font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                         {project.type}
                       </span>
                    )}
                  </h3>
                  <Link
                    href={project.url}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    Link <ExternalLink size={12} />
                  </Link>
                </div>

                <p className="mb-6 flex-1 text-sm text-slate-400">
                  {project.desc}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech, j) => (
                    <span
                      key={j}
                      className="rounded-full bg-brand-secondary/10 border border-brand-secondary/20 px-3 py-1 text-xs font-medium text-brand-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
