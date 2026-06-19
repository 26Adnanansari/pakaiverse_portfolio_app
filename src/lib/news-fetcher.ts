import Parser from "rss-parser";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string | null;
  source: string;
  category: string;
  publishedAt: string;
  author: string | null;
}

// ============================================================
// ALL FREE RSS FEEDS — No API key required
// ============================================================
const RSS_FEEDS: Record<string, string[]> = {
  nvidia: [
    "https://nvidianews.nvidia.com/newsreleases.xml",
    "https://feeds.feedburner.com/nvidiablog",
    "https://developer.nvidia.com/blog/feed/",
  ],
  openai: [
    "https://openai.com/blog/rss.xml",
  ],
  google: [
    "https://blog.google/technology/ai/rss/",
    "https://developers.googleblog.com/feeds/posts/default",
  ],
  claude: [
    "https://www.anthropic.com/rss.xml",
  ],
  deepseek: [
    // DeepSeek blog via RSS
    "https://api.deepseek.com/news/rss",
    // Fallback: HuggingFace DeepSeek papers
    "https://huggingface.co/blog/feed.xml",
  ],
  mistral: [
    "https://mistral.ai/feed.xml",
  ],
  llm: [
    "https://huggingface.co/blog/feed.xml",
    "https://blog.eleuther.ai/feed.xml",
  ],
  general: [
    "https://techcrunch.com/category/artificial-intelligence/feed/",
    "https://venturebeat.com/category/ai/feed/",
    "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
    "https://feeds.arstechnica.com/arstechnica/index",
  ],
};

const rssParser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "PakAiVerse-NewsBot/2.0 (+https://pakaiverse.com)",
  },
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["enclosure", "enclosure"],
    ],
  },
});

// ============================================================
// IMAGE EXTRACTION & FORMATTING (Free AI Formatter)
// ============================================================
export const FALLBACK_IMAGES: Record<string, string[]> = {
  nvidia: [
    "https://images.unsplash.com/photo-1610812389656-b816a7f920da?q=80&w=800&auto=format&fit=crop", // GPU
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop", // Server
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop", // Chip
    "https://images.unsplash.com/photo-1591462286820-2136e0d37e6f?q=80&w=800&auto=format&fit=crop"  // Circuit
  ],
  openai: [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop", // OpenAI Logo
    "https://images.unsplash.com/photo-1684369176140-5205561a3556?q=80&w=800&auto=format&fit=crop", // ChatGPT
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop", // AI Brain
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=800&auto=format&fit=crop"  // Robot dog/AI
  ],
  google: [
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop", // Server racks
    "https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=800&auto=format&fit=crop", // Colorful tech
    "https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?q=80&w=800&auto=format&fit=crop"  // Server lights
  ],
  llm: [
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop", // Code Matrix
    "https://images.unsplash.com/photo-1555949963-aa79dcee57d5?q=80&w=800&auto=format&fit=crop", // Screen Code
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop"  // Programming
  ],
  general: [
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=800&auto=format&fit=crop", // Tech generic
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop", // CPU
    "https://images.unsplash.com/photo-1531297172868-9f140ee6ea51?q=80&w=800&auto=format&fit=crop", // Data visualization
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop", // Global network
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop"  // Tech collaboration
  ]
};

export function getFallbackImage(category: string, title: string): string {
  const images = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.general;
  const sum = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return images[sum % images.length];
}

function autoCategorize(text: string, defaultCategory: string): string {
  const t = text.toLowerCase();
  if (t.includes("nvidia") || t.includes("gpu") || t.includes("cuda")) return "nvidia";
  if (t.includes("openai") || t.includes("chatgpt") || t.includes("gpt")) return "openai";
  if (t.includes("google") || t.includes("gemini") || t.includes("bard")) return "google";
  if (t.includes("claude") || t.includes("anthropic")) return "claude";
  if (t.includes("llama") || t.includes("mistral") || t.includes("llm")) return "llm";
  return defaultCategory;
}

function extractImage(item: Parser.Item & {
  mediaContent?: { $?: { url?: string } };
  mediaThumbnail?: { $?: { url?: string } };
  enclosure?: { url?: string; type?: string };
}): string | null {
  if (item.mediaContent?.$?.url) return item.mediaContent.$.url;
  if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;
  if (item.enclosure?.url && item.enclosure?.type?.startsWith("image")) return item.enclosure.url;
  
  const html = (item as Record<string, unknown>)["content:encoded"] as string || item.content || "";
  const match = html.match(/<img[^>]+src=["']([^"'>]+)["']/i);
  if (match) return match[1];

  return null;
}

// ============================================================
// FETCH FROM SINGLE RSS FEED
// ============================================================
async function fetchFeed(feedUrl: string, feedCategory: string): Promise<NewsArticle[]> {
  try {
    const feed = await rssParser.parseURL(feedUrl);
    return feed.items.slice(0, 4).map((item) => {
      const url = item.link || item.guid || "";
      const title = item.title?.trim() || "Untitled";
      const description = (item.contentSnippet || item.summary || "").slice(0, 400);
      const fullText = title + " " + description;
      
      const category = autoCategorize(fullText, feedCategory);
      let imageUrl = extractImage(item as Parameters<typeof extractImage>[0]);
      
      if (!imageUrl) {
        imageUrl = getFallbackImage(category, title);
      }

      return {
        id: Buffer.from(url).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 20),
        title,
        description,
        content: ((item as unknown as Record<string, unknown>)["content:encoded"] as string) || item.content || item.contentSnippet || "",
        url,
        imageUrl,
        source: feed.title?.trim() || feedUrl,
        category,
        publishedAt: item.isoDate || new Date().toISOString(),
        author: item.creator || (item as unknown as { author?: string }).author || null,
      };
    });
  } catch {
    return [];
  }
}

// ============================================================
// FETCH ALL NEWS
// ============================================================
export async function fetchAllNews(): Promise<NewsArticle[]> {
  const tasks = Object.entries(RSS_FEEDS).flatMap(([category, urls]) =>
    urls.map((url) => fetchFeed(url, category))
  );

  const results = await Promise.allSettled(tasks);
  const all: NewsArticle[] = results
    .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  // Deduplicate by URL
  const seen = new Set<string>();
  const unique = all.filter((a) => {
    if (!a.url || seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });

  return unique.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// ============================================================
// SAVE TO NEON DB (skip duplicates)
// ============================================================
export async function saveArticlesToDb(articlesList: NewsArticle[]): Promise<number> {
  let savedCount = 0;
  for (const article of articlesList) {
    try {
      const existing = await db.select({ id: articles.id }).from(articles).where(eq(articles.url, article.url));
      if (existing.length === 0) {
        await db.insert(articles).values({
          id: article.id,
          title: article.title,
          description: article.description.slice(0, 500),
          content: article.content?.slice(0, 5000) || null,
          url: article.url,
          imageUrl: article.imageUrl,
          source: article.source,
          category: article.category,
          publishedAt: new Date(article.publishedAt),
          author: article.author,
        });
        savedCount++;
      }
    } catch {
      // skip duplicates / constraint errors silently
    }
  }
  return savedCount;
}
