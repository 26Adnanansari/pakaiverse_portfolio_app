import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";
import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import AIUpdatesClient from "./AIUpdatesClient";

export const revalidate = 3600;

// Shared type for both mock and DB data
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


// Category display config
const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  nvidia: { label: "NVIDIA", color: "#76B900", bg: "rgba(118,185,0,0.1)", icon: "🟢" },
  openai: { label: "OpenAI", color: "#10A37F", bg: "rgba(16,163,127,0.1)", icon: "🤖" },
  google: { label: "Google AI", color: "#4285F4", bg: "rgba(66,133,244,0.1)", icon: "🔵" },
  llm: { label: "LLM / Open Source", color: "#B829DD", bg: "rgba(184,41,221,0.1)", icon: "🧠" },
  general: { label: "Tech News", color: "#00D4FF", bg: "rgba(0,212,255,0.1)", icon: "⚡" },
};

// Mock articles for when DB is empty (placeholder for fresh setup)
const MOCK_ARTICLES: ArticleItem[] = [

  {
    id: "mock-1",
    title: "OpenAI Releases GPT-5 with Groundbreaking Reasoning Capabilities",
    description: "OpenAI has unveiled its latest language model featuring unprecedented reasoning capabilities, improved accuracy, and significantly reduced hallucinations across complex tasks.",
    url: "https://openai.com/blog",
    imageUrl: null,
    source: "OpenAI Blog",
    category: "openai",
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    author: "OpenAI Team",
  },
  {
    id: "mock-2",
    title: "NVIDIA H200 GPU Sets New AI Performance Records",
    description: "NVIDIA's latest H200 Tensor Core GPU delivers 141GB of HBM3e memory and remarkable performance improvements for large language model training and inference workloads.",
    url: "https://nvidianews.nvidia.com",
    imageUrl: null,
    source: "NVIDIA Newsroom",
    category: "nvidia",
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    author: "NVIDIA",
  },
  {
    id: "mock-3",
    title: "Google DeepMind Gemini Ultra 2.0 Surpasses Human Expert Level",
    description: "Google DeepMind announces Gemini Ultra 2.0, achieving superhuman performance on medical, legal, and scientific benchmarks while being 50% more efficient than its predecessor.",
    url: "https://blog.google/technology/ai",
    imageUrl: null,
    source: "Google AI Blog",
    category: "google",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    author: "Google DeepMind",
  },
  {
    id: "mock-4",
    title: "Llama 4 Released: Meta's Open Source AI Redefines the Ecosystem",
    description: "Meta AI launches Llama 4, the most capable open-source large language model to date, featuring multimodal capabilities and support for 128k context length with permissive licensing.",
    url: "https://huggingface.co/blog",
    imageUrl: null,
    source: "Hugging Face Blog",
    category: "llm",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    author: "Meta AI",
  },
  {
    id: "mock-5",
    title: "Mistral Large 3: European AI Champion Takes on GPT-4",
    description: "Mistral AI unveils Mistral Large 3, a frontier model with exceptional code generation, multilingual support, and performance rivaling the world's leading proprietary models.",
    url: "https://huggingface.co/blog",
    imageUrl: null,
    source: "Hugging Face Blog",
    category: "llm",
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    author: "Mistral AI",
  },
  {
    id: "mock-6",
    title: "AI Agents Are Now Automating Full Software Development Cycles",
    description: "A new wave of autonomous AI coding agents can now write, test, debug, and deploy complete applications with minimal human intervention, transforming software development workflows.",
    url: "https://techcrunch.com/category/artificial-intelligence",
    imageUrl: null,
    source: "TechCrunch AI",
    category: "general",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    author: "TechCrunch",
  },
];

export default async function AIUpdatesPage() {
  let allPosts: ArticleItem[] = [];

  try {
    const dbPosts = await db.select().from(articles).orderBy(desc(articles.publishedAt));
    allPosts = dbPosts.length > 0
      ? dbPosts.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description ?? "",
          url: p.url,
          imageUrl: p.imageUrl ?? null,
          source: p.source ?? "",
          category: p.category ?? "general",
          publishedAt: new Date(p.publishedAt),
          author: p.author ?? null,
        }))
      : MOCK_ARTICLES;
  } catch {
    allPosts = MOCK_ARTICLES;
  }

  const serializable = allPosts.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    url: p.url,
    imageUrl: p.imageUrl ?? null,
    source: p.source ?? "",
    category: p.category ?? "general",
    publishedAt: p.publishedAt instanceof Date ? p.publishedAt.toISOString() : String(p.publishedAt),
    author: p.author ?? null,
    config: CATEGORY_CONFIG[p.category ?? "general"] ?? CATEGORY_CONFIG["general"],
  }));

  const categories = ["All", ...Object.keys(CATEGORY_CONFIG)];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0F] pt-28 pb-20">
        {/* Background glow */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="container-page">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm text-slate-300 font-medium">Auto-Updated Every 24 Hours</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-white mb-4 leading-tight">
              AI <span className="gradient-text">Updates</span> Hub
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Daily curated intelligence from NVIDIA, OpenAI, Google DeepMind, and the open-source LLM ecosystem — hand-picked for builders like you.
            </p>
          </div>

          {/* Client component handles filtering + animation */}
          <AIUpdatesClient posts={serializable} categories={categories} categoryConfig={CATEGORY_CONFIG} />
        </div>
      </main>
      <Footer />
    </>
  );
}
