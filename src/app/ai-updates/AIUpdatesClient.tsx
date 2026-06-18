"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ExternalLink, Zap, Filter } from "lucide-react";

interface Post {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  source: string;
  category: string;
  publishedAt: string;
  author: string | null;
  config: {
    label: string;
    color: string;
    bg: string;
    icon: string;
  };
}

interface Props {
  posts: Post[];
  categories: string[];
  categoryConfig: Record<string, { label: string; color: string; bg: string; icon: string }>;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return "Just now";
}

export default function AIUpdatesClient({ posts, categories, categoryConfig }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <div className="flex items-center gap-2 mr-2 text-slate-500">
          <Filter className="w-4 h-4" />
          <span className="text-sm">Filter:</span>
        </div>
        {categories.map((cat) => {
          const cfg = cat === "All" ? null : categoryConfig[cat];
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                isActive
                  ? "border-brand-primary/60 text-brand-primary bg-brand-primary/10"
                  : "glass text-slate-400 hover:text-white hover:border-white/20"
              }`}
              style={
                isActive && cfg
                  ? { borderColor: cfg.color + "60", color: cfg.color, backgroundColor: cfg.bg }
                  : {}
              }
            >
              {cfg ? `${cfg.icon} ${cfg.label}` : "✦ All"}
            </button>
          );
        })}
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-center gap-6 mb-10 text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-brand-primary" />
          {filtered.length} articles
        </span>
        <span>•</span>
        <span>Sources: NVIDIA, OpenAI, Google, HuggingFace & more</span>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              className="glass rounded-2xl overflow-hidden group hover:border-white/20 transition-all duration-300 flex flex-col hover:-translate-y-1"
            >
              {/* Top accent bar */}
              <div
                className="h-0.5 w-full"
                style={{ background: `linear-gradient(90deg, ${post.config.color}, transparent)` }}
              />

              <div className="p-6 flex flex-col flex-grow">
                {/* Category + Time */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
                    style={{ backgroundColor: post.config.bg, color: post.config.color }}
                  >
                    {post.config.icon} {post.config.label}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    {timeAgo(post.publishedAt)}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-base font-bold text-white mb-3 group-hover:text-brand-primary transition-colors duration-200 line-clamp-2 leading-snug">
                  {post.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-slate-400 mb-5 line-clamp-3 leading-relaxed flex-grow">
                  {post.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                  <span className="text-xs text-slate-500 truncate max-w-[120px]">
                    {post.source}
                  </span>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 transition-all duration-200"
                    style={{
                      backgroundColor: post.config.bg,
                      color: post.config.color,
                    }}
                  >
                    Read Full
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-slate-400 text-lg font-medium">No articles in this category yet.</p>
          <p className="text-slate-600 text-sm mt-2">Check back after the next daily update!</p>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <div className="glass inline-flex flex-col sm:flex-row items-center gap-4 px-8 py-5 rounded-2xl">
          <div className="text-left">
            <p className="text-white font-semibold text-sm">Want AI integrated into your business?</p>
            <p className="text-slate-400 text-xs mt-0.5">PakAiVerse builds custom AI solutions for startups & enterprises.</p>
          </div>
          <a
            href="/#contact"
            className="whitespace-nowrap rounded-full bg-brand-primary/10 border border-brand-primary/30 px-5 py-2.5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/20 transition-all duration-200"
          >
            Let&apos;s Talk →
          </a>
        </div>
      </div>
    </>
  );
}
