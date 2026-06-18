// Shared config and types for AI Updates — imported by page.tsx and AIUpdatesClient.tsx

export type ArticleItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  source: string;
  category: string;
  publishedAt: Date;
  author: string | null;
};

export const CATEGORY_CONFIG: Record<string, {
  label: string; color: string; bg: string; icon: string; gradient: string;
}> = {
  nvidia:   { label: "NVIDIA",       color: "#76B900", bg: "rgba(118,185,0,0.12)",   icon: "🟢", gradient: "from-[#76B900]/20 to-transparent" },
  openai:   { label: "OpenAI",       color: "#10A37F", bg: "rgba(16,163,127,0.12)",  icon: "🤖", gradient: "from-[#10A37F]/20 to-transparent" },
  google:   { label: "Google AI",    color: "#4285F4", bg: "rgba(66,133,244,0.12)",  icon: "🔵", gradient: "from-[#4285F4]/20 to-transparent" },
  claude:   { label: "Claude",       color: "#D97706", bg: "rgba(217,119,6,0.12)",   icon: "✦",  gradient: "from-[#D97706]/20 to-transparent" },
  deepseek: { label: "DeepSeek",     color: "#7C3AED", bg: "rgba(124,58,237,0.12)",  icon: "🔮", gradient: "from-[#7C3AED]/20 to-transparent" },
  mistral:  { label: "Mistral AI",   color: "#EF4444", bg: "rgba(239,68,68,0.12)",   icon: "🌪️", gradient: "from-[#EF4444]/20 to-transparent" },
  llm:      { label: "Open Source",  color: "#B829DD", bg: "rgba(184,41,221,0.12)",  icon: "🧠", gradient: "from-[#B829DD]/20 to-transparent" },
  general:  { label: "Tech News",    color: "#00D4FF", bg: "rgba(0,212,255,0.12)",   icon: "⚡", gradient: "from-[#00D4FF]/20 to-transparent" },
};
