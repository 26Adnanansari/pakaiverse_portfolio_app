import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";
import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import AIUpdatesClient from "./AIUpdatesClient";
import { CATEGORY_CONFIG, type ArticleItem } from "./config";

export const revalidate = 3600;

// Professional mock articles — shown until real RSS data arrives
const MOCK_ARTICLES: ArticleItem[] = [
  { id: "m1", title: "OpenAI o3 Model Achieves Record-Breaking Scores on AIME Math Benchmarks", description: "OpenAI's latest o3 reasoning model has set new records on the American Invitational Mathematics Examination, surpassing previous AI and human expert baselines.", url: "https://openai.com/blog", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80", source: "OpenAI Blog", category: "openai", publishedAt: new Date(Date.now() - 1 * 3600000), author: "OpenAI" },
  { id: "m2", title: "NVIDIA Blackwell GB200 NVL72 Rack Ships to Hyperscalers Worldwide", description: "NVIDIA has begun mass shipments of the GB200 NVL72 rack system, offering 72 Blackwell GPUs with 1.4 exaflops of AI compute — reshaping data center AI.", url: "https://nvidianews.nvidia.com", imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80", source: "NVIDIA Newsroom", category: "nvidia", publishedAt: new Date(Date.now() - 2 * 3600000), author: "NVIDIA" },
  { id: "m3", title: "Claude 4 Sonnet Tops LMSys Chatbot Arena with 98th Percentile Score", description: "Anthropic's Claude 4 Sonnet has claimed the top spot on the LMSys Chatbot Arena leaderboard, surpassing GPT-4o and Gemini Ultra on coding and reasoning tasks.", url: "https://www.anthropic.com/news", imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80", source: "Anthropic News", category: "claude", publishedAt: new Date(Date.now() - 3 * 3600000), author: "Anthropic" },
  { id: "m4", title: "DeepSeek V3 Matches GPT-4 Performance at 1/10th the Training Cost", description: "DeepSeek's V3 model demonstrates frontier-level AI performance at dramatically reduced cost using innovative MoE architecture and efficient training techniques.", url: "https://huggingface.co/deepseek-ai", imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80", source: "DeepSeek AI", category: "deepseek", publishedAt: new Date(Date.now() - 5 * 3600000), author: "DeepSeek" },
  { id: "m5", title: "Google Gemini 2.0 Flash Brings Real-Time Multimodal AI to Android Devices", description: "Google's Gemini 2.0 Flash is now on-device for Android — enabling real-time image understanding and context-aware assistance without cloud data transfer.", url: "https://blog.google/technology/ai", imageUrl: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80", source: "Google AI Blog", category: "google", publishedAt: new Date(Date.now() - 6 * 3600000), author: "Google DeepMind" },
  { id: "m6", title: "Mistral Large 3 Outperforms GPT-4o on Multilingual Coding Tasks", description: "Mistral AI's flagship Large 3 model delivers state-of-the-art results across 20+ programming languages and leads on European language benchmarks.", url: "https://mistral.ai/news", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", source: "Mistral AI", category: "mistral", publishedAt: new Date(Date.now() - 8 * 3600000), author: "Mistral AI" },
  { id: "m7", title: "Meta Llama 4 Scout: 10M Token Context Window Released Open Source", description: "Meta's Llama 4 Scout introduces a record 10 million token context window for open-source LLMs — enabling full codebase and book-length analysis in a single pass.", url: "https://ai.meta.com", imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80", source: "Meta AI", category: "llm", publishedAt: new Date(Date.now() - 9 * 3600000), author: "Meta AI" },
  { id: "m8", title: "AI Agents Now Autonomously Deploy Production Code at Major Tech Companies", description: "Fortune 500 companies report AI coding agents autonomously writing, testing, and deploying production-ready code — dramatically accelerating release cycles.", url: "https://techcrunch.com/category/artificial-intelligence", imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80", source: "TechCrunch AI", category: "general", publishedAt: new Date(Date.now() - 11 * 3600000), author: "TechCrunch" },
  { id: "m9", title: "Hugging Face Launches Inference Providers for 100k+ Open Models", description: "Hugging Face's Inference Providers feature lets developers deploy any of 100,000+ open-source models via a unified API — simplifying AI integration for startups.", url: "https://huggingface.co/blog", imageUrl: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&q=80", source: "Hugging Face Blog", category: "llm", publishedAt: new Date(Date.now() - 13 * 3600000), author: "Hugging Face" },
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

  // Serialize dates for client component
  const serialized = allPosts.map(p => ({
    ...p,
    publishedAt: p.publishedAt instanceof Date ? p.publishedAt.toISOString() : String(p.publishedAt),
    config: CATEGORY_CONFIG[p.category] ?? CATEGORY_CONFIG["general"],
  }));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0F] pt-24 pb-24">
        {/* Ambient background */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-brand-secondary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#D97706]/5 rounded-full blur-[80px]" />
        </div>

        <div className="container-page">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs text-slate-300 font-medium tracking-wide">Live — Updated 15× Daily</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-white mb-4 leading-tight tracking-tight">
              AI <span className="gradient-text">Intelligence</span> Hub
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Real-time news from NVIDIA, OpenAI, Claude, DeepSeek, Mistral, Google AI and the open-source LLM ecosystem — curated for builders and tech professionals.
            </p>
          </div>

          <AIUpdatesClient posts={serialized} categoryConfig={CATEGORY_CONFIG} />
        </div>
      </main>
      <Footer />
    </>
  );
}
