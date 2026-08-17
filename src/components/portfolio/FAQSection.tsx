"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    question: "How much does a custom web app cost?",
    answer:
      "Our custom web app development starts from $300 for a basic app and goes up to $2,000+ for complex SaaS platforms with auth, billing, admin dashboards, and AI features. A simple landing page starts from $100. We always provide a detailed quote after reviewing your requirements.",
  },
  {
    question: "How long does it take to build a website or web app?",
    answer:
      "A landing page takes 3–5 days. A standard business website takes 1–2 weeks. A full-featured web app or SaaS platform typically takes 4–8 weeks depending on complexity, integrations, and feedback cycles. We provide a project timeline in our initial proposal.",
  },
  {
    question: "Do you build SaaS platforms?",
    answer:
      "Yes — SaaS development is one of our core specializations. We build complete SaaS products with user authentication (NextAuth), subscription billing (Stripe), multi-tenant architecture, admin dashboards, and API integrations. Starting from $500.",
  },
  {
    question: "Can you integrate AI into my existing app?",
    answer:
      "Absolutely. We integrate Google Gemini, OpenAI GPT, Groq, and custom LLMs into web applications. Use cases include AI chatbots, content generation, data analysis, recommendation engines, and intelligent automation. We can add AI to any existing Next.js, React, or Node.js app.",
  },
  {
    question: "Do you work with clients in the USA, UK, and Canada?",
    answer:
      "Yes — the majority of our clients are based in the USA, UK, Canada, and Australia. We communicate in English, are available for calls across time zones, and accept payment in USD via Stripe, PayPal, and bank transfer.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "Our primary stack is Next.js 14 (App Router), React, TypeScript, PostgreSQL with Drizzle ORM, Tailwind CSS, and Vercel for deployment. For AI, we use Google Gemini, OpenAI, and Groq. For payments, we use Stripe. For media, we use Cloudinary.",
  },
  {
    question: "Do you offer SEO services?",
    answer:
      "Yes. We offer technical SEO (structured data, meta tags, Core Web Vitals), on-page SEO, content strategy, and performance optimization. SEO packages start from $50/month. All websites we build include proper semantic HTML, JSON-LD schemas, sitemap, and robots.txt by default.",
  },
  {
    question: "What is your payment process?",
    answer:
      "Our standard process is: 50% advance payment before we start, and 50% on delivery. For larger projects, we offer milestone-based payments. We accept USD via PayPal, Stripe, and bank transfer (SWIFT/IBAN).",
  },
  {
    question: "Do you provide post-launch support?",
    answer:
      "Yes. Every project includes 1 month of free support after launch — covering bug fixes, minor adjustments, and deployment help. After that, we offer affordable monthly maintenance packages.",
  },
  {
    question: "Can you build an e-commerce store?",
    answer:
      "Yes. We build full-featured e-commerce stores with product management, shopping cart, Stripe payments, order tracking, and admin dashboards. We also build custom multi-vendor marketplaces. E-commerce projects start from $200.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // ─── FAQPage JSON-LD ──────────────────────────────────────────────────────
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="section-pad relative z-10" id="faq" aria-labelledby="faq-heading">
      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container-page max-w-3xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-4 py-1.5 font-mono text-xs tracking-widest text-brand-primary uppercase"
          >
            Common Questions
          </motion.span>
          <motion.h2
            id="faq-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl font-bold text-white"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-slate-400 text-base max-w-xl mx-auto"
          >
            Everything you need to know about working with PakAiVerse — pricing, timeline,
            tech stack, and support.
          </motion.p>
        </div>

        {/* FAQ Accordion */}
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: index * 0.04 }}
              >
                <div
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-brand-primary/40 bg-brand-primary/5"
                      : "border-white/8 bg-white/3 hover:border-white/15"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span
                      className={`font-semibold text-base transition-colors ${
                        isOpen ? "text-brand-primary" : "text-white group-hover:text-brand-primary"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`flex-shrink-0 rounded-full p-1 transition-all ${
                        isOpen
                          ? "bg-brand-primary/20 text-brand-primary"
                          : "bg-white/5 text-slate-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary"
                      }`}
                    >
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <p className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Below FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-slate-400 text-sm mb-4">
            Still have questions? We&apos;re happy to help.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-primary/90"
          >
            Get a Free Consultation
          </a>
        </motion.div>
      </div>
    </section>
  );
}
