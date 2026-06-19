"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { PORTFOLIO, waLink } from "@/config/portfolio";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "Web Application",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (data.success && data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank");
      } else {
        // Fallback if API fails
        const text = `Hi Adnan! 👋\n\nName: ${formData.name}\nEmail: ${formData.email}\nProject Type: ${formData.type}\n\nMessage: ${formData.message}`;
        window.open(waLink(text), "_blank");
      }
    } catch (error) {
      console.error(error);
      const text = `Hi Adnan! 👋\n\nName: ${formData.name}\nEmail: ${formData.email}\nProject Type: ${formData.type}\n\nMessage: ${formData.message}`;
      window.open(waLink(text), "_blank");
    } finally {
      setIsSubmitting(false);
      setFormData({ name: "", email: "", type: "Web Application", message: "" });
    }
  };

  return (
    <section className="section-pad relative z-10" id="contact">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Let&apos;s <span className="text-brand-secondary">Build Together</span>
          </h2>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column — Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <p className="text-lg text-slate-400 mb-4 max-w-md">
              Ready to start your next project? Drop me a message. I usually reply within a few hours.
            </p>

            <a
              href={`mailto:${PORTFOLIO.email}`}
              className="group glass-card flex items-center gap-6 rounded-2xl p-6 transition hover:bg-white/5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary group-hover:text-black transition-colors">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-400">Email Me</p>
                <p className="font-medium text-white">{PORTFOLIO.email}</p>
              </div>
            </a>

            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group glass-card flex items-center gap-6 rounded-2xl p-6 transition hover:bg-white/5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-black transition-colors">
                <MessageCircle size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-400">WhatsApp</p>
                <p className="font-medium text-white">{PORTFOLIO.whatsappDisplay}</p>
              </div>
            </a>

            <div className="glass-card flex items-center gap-6 rounded-2xl p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-secondary/10 text-brand-secondary">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-400">Location</p>
                <p className="font-medium text-white">{PORTFOLIO.location}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column — Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-6 sm:p-8"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-300">Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="type" className="text-sm font-medium text-slate-300">Project Type</label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#151520] px-4 py-3 text-white focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition"
                >
                  <option>Web Application</option>
                  <option>E-Commerce Store</option>
                  <option>SaaS Dashboard</option>
                  <option>Mobile App</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-300">Message</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl bg-brand-primary px-6 py-4 font-bold text-black transition hover:bg-brand-primary/90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Send Message via WhatsApp"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
