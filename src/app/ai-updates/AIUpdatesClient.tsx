"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Clock, Zap, LayoutGrid, List } from "lucide-react";
import { CATEGORY_CONFIG } from "./config";

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
  config: { label: string; color: string; bg: string; icon: string; gradient: string };
}

interface Props {
  posts: Post[];
  categoryConfig: typeof CATEGORY_CONFIG;
}

const PAGE_SIZE = 12;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

// Reusable image with error fallback
function Thumb({
  src,
  alt,
  className,
  icon,
  color,
}: {
  src: string | null;
  alt: string;
  className?: string;
  icon: string;
  color: string;
}) {
  const [err, setErr] = useState(false);
  if (src && !err) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setErr(true)}
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={`${className} flex items-center justify-center`}
      style={{ background: `linear-gradient(135deg, ${color}20, #0A0A0F 80%)` }}
    >
      <span className="text-4xl opacity-25">{icon}</span>
    </div>
  );
}

// ── HERO CARD ─────────────────────────────────────────────────
function HeroCard({ post }: { post: Post }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/25 transition-all duration-400 hover:-translate-y-1"
        style={{ background: "#0D0D14", boxShadow: `0 0 60px ${post.config.color}12` }}
      >
        {/* Top color line */}
        <div
          className="h-[2px] w-full"
          style={{ background: `linear-gradient(90deg, ${post.config.color}, ${post.config.color}60, transparent)` }}
        />

        <div className="sm:grid sm:grid-cols-5">
          {/* Image — 3/5 width on desktop */}
          <div className="sm:col-span-3 relative overflow-hidden h-52 sm:h-72">
            {post.imageUrl && !imgErr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={() => setImgErr(true)}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${post.config.color}25 0%, #0A0A0F 60%, ${post.config.color}08 100%)`,
                }}
              >
                <span className="text-9xl opacity-15">{post.config.icon}</span>
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D14] via-[#0D0D14]/20 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#0D0D14]/60" />

            {/* Badges on image */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border"
                style={{
                  backgroundColor: `${post.config.color}20`,
                  color: post.config.color,
                  borderColor: `${post.config.color}40`,
                }}
              >
                {post.config.icon} {post.config.label}
              </span>
            </div>
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/40 text-white backdrop-blur-md border border-white/15">
                ⭐ Featured
              </span>
            </div>
          </div>

          {/* Content — 2/5 width */}
          <div className="sm:col-span-2 p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-3 group-hover:text-brand-primary transition-colors duration-200">
                {post.title}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed line-clamp-4">
                {post.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-white/[0.07] flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-slate-300">{post.source}</span>
                <span className="text-[11px] text-slate-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {timeAgo(post.publishedAt)}
                  {post.author && <> · {post.author}</>}
                </span>
              </div>
              <span
                className="flex items-center gap-1.5 text-sm font-semibold transition-transform duration-200 group-hover:translate-x-0.5"
                style={{ color: post.config.color }}
              >
                Read <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

// ── LIST ITEM (TechCrunch style) ──────────────────────────────
function NewsListItem({ post, index }: { post: Post; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035, duration: 0.25 }}
    >
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-4 py-4 px-4 rounded-xl hover:bg-white/[0.03] transition-all duration-200 border-b border-white/[0.05] last:border-0"
      >
        {/* Thumbnail */}
        <div className="flex-shrink-0 w-28 h-[72px] sm:w-36 sm:h-24 rounded-xl overflow-hidden">
          <Thumb
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            icon={post.config.icon}
            color={post.config.color}
          />
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          {/* Category + time */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
              style={{ backgroundColor: post.config.bg, color: post.config.color }}
            >
              {post.config.label}
            </span>
            <span className="text-[11px] text-slate-600 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> {timeAgo(post.publishedAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-[15px] font-semibold text-white line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors duration-150">
            {post.title}
          </h3>

          {/* Source */}
          <p className="text-[11px] text-slate-600 mt-1 truncate">
            {post.source}
            {post.author && ` · ${post.author}`}
          </p>
        </div>

        {/* Arrow */}
        <ExternalLink
          className="flex-shrink-0 w-3.5 h-3.5 self-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1"
          style={{ color: post.config.color }}
        />
      </a>
    </motion.div>
  );
}

// ── GRID CARD ─────────────────────────────────────────────────
function NewsGridCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045, duration: 0.28 }}
    >
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full"
      >
        <div
          className="border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col hover:border-white/22 hover:-translate-y-1 transition-all duration-300"
          style={{ background: "#0D0D14", boxShadow: `0 0 0 0 ${post.config.color}00` }}
        >
          <div
            className="h-[2px] w-full"
            style={{ background: `linear-gradient(90deg, ${post.config.color}, transparent)` }}
          />

          {/* Image */}
          <div className="relative overflow-hidden h-44">
            <Thumb
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              icon={post.config.icon}
              color={post.config.color}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span
              className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm"
              style={{ backgroundColor: `${post.config.color}30`, color: post.config.color }}
            >
              {post.config.icon} {post.config.label}
            </span>
          </div>

          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors flex-grow">
              {post.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
              {post.description}
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] mt-auto">
              <span className="text-[11px] text-slate-600 truncate max-w-[65%]">
                {post.source} · {timeAgo(post.publishedAt)}
              </span>
              <ExternalLink className="w-3 h-3 flex-shrink-0" style={{ color: post.config.color }} />
            </div>
          </div>
        </div>
      </a>
    </motion.article>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────
export default function AIUpdatesClient({ posts, categoryConfig }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"feed" | "grid">("feed");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categories = [
    { key: "all", label: "All", icon: "⚡", color: "#00D4FF" },
    ...Object.entries(categoryConfig).map(([key, val]) => ({
      key,
      label: val.label,
      icon: val.icon,
      color: val.color,
    })),
  ];

  const filtered = useMemo(() => {
    setVisibleCount(PAGE_SIZE);
    if (activeCategory === "all") return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  const hero = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      {/* Stats */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-8 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-brand-primary" />
          {posts.length} articles
        </span>
        <span className="text-slate-700">·</span>
        <span>{Object.keys(categoryConfig).length} AI sources</span>
        <span className="text-slate-700">·</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> Refreshed every 96 min
        </span>
      </div>

      {/* Category filter + view toggle */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center gap-2 flex-nowrap">
          {categories.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  active
                    ? "text-black border-transparent"
                    : "bg-transparent text-slate-400 hover:text-white border-white/10 hover:border-white/25"
                }`}
                style={active ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
              >
                {cat.icon} {cat.label}
              </button>
            );
          })}
        </div>

        {/* View toggle */}
        <div className="ml-auto flex-shrink-0 flex items-center gap-0.5 bg-white/[0.05] rounded-xl p-1 border border-white/10">
          <button
            onClick={() => setViewMode("feed")}
            className={`p-1.5 rounded-lg transition-all ${viewMode === "feed" ? "bg-white/15 text-white" : "text-slate-500 hover:text-white"}`}
            title="Feed view"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white/15 text-white" : "text-slate-500 hover:text-white"}`}
            title="Grid view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-slate-500"
          >
            <span className="text-5xl mb-4 block">📭</span>
            <p className="text-base">No articles in this category yet.</p>
            <p className="text-xs mt-1 text-slate-600">Check back soon — news refreshes every 96 minutes.</p>
          </motion.div>
        ) : viewMode === "feed" ? (
          <motion.div
            key={`feed-${activeCategory}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Hero */}
            {hero && <div className="mb-8"><HeroCard post={hero} /></div>}

            {/* List */}
            {rest.length > 0 && (
              <div
                className="rounded-2xl overflow-hidden border border-white/[0.07] px-2 py-1"
                style={{ background: "#0D0D14" }}
              >
                {rest.slice(0, visibleCount).map((post, i) => (
                  <NewsListItem key={post.id} post={post} index={i} />
                ))}
              </div>
            )}

            {visibleCount < rest.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-8 py-3 rounded-full border border-white/10 text-sm font-semibold text-slate-400 hover:text-white hover:border-brand-primary/50 hover:bg-white/[0.04] transition-all duration-200"
                >
                  Load {Math.min(PAGE_SIZE, rest.length - visibleCount)} more&nbsp;
                  <span className="text-slate-600">({rest.length - visibleCount} remaining)</span>
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key={`grid-${activeCategory}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.slice(0, visibleCount).map((post, i) => (
                <NewsGridCard key={post.id} post={post} index={i} />
              ))}
            </div>
            {visibleCount < filtered.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-8 py-3 rounded-full border border-white/10 text-sm font-semibold text-slate-400 hover:text-white hover:border-brand-primary/50 hover:bg-white/[0.04] transition-all duration-200"
                >
                  Load More&nbsp;
                  <span className="text-slate-600">({filtered.length - visibleCount} remaining)</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom CTA */}
      <div className="mt-20 text-center">
        <div
          className="inline-flex flex-col sm:flex-row items-center gap-5 px-8 py-6 rounded-2xl max-w-xl mx-auto border border-white/10"
          style={{ background: "#0D0D14" }}
        >
          <div className="text-left">
            <p className="text-white font-bold">Want AI integrated into your business?</p>
            <p className="text-slate-400 text-sm mt-0.5">
              PakAiVerse builds custom AI solutions for startups &amp; enterprises.
            </p>
          </div>
          <a
            href="/#contact"
            className="whitespace-nowrap rounded-full bg-brand-primary px-6 py-2.5 text-sm font-bold text-black hover:opacity-90 transition-all duration-200"
          >
            Let&apos;s Talk →
          </a>
        </div>
      </div>
    </>
  );
}
