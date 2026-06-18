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
// IMAGE EXTRACTION — multiple strategies
// ============================================================
function extractImage(item: Parser.Item & {
  mediaContent?: { $?: { url?: string } };
  mediaThumbnail?: { $?: { url?: string } };
  enclosure?: { url?: string; type?: string };
}): string | null {
  // 1. media:content
  if (item.mediaContent?.$?.url) return item.mediaContent.$.url;

  // 2. media:thumbnail
  if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;

  // 3. enclosure (podcasts / images)
  if (item.enclosure?.url && item.enclosure?.type?.startsWith("image"))
    return item.enclosure.url;

  // 4. Parse from HTML content
  const html = (item as Record<string, unknown>)["content:encoded"] as string || item.content || "";
  const match = html.match(/<img[^>]+src=["']([^"'>]+)["']/i);
  if (match) return match[1];

  return null;
}

// ============================================================
// FETCH FROM SINGLE RSS FEED
// ============================================================
async function fetchFeed(feedUrl: string, category: string): Promise<NewsArticle[]> {
  try {
    const feed = await rssParser.parseURL(feedUrl);
    return feed.items.slice(0, 4).map((item) => {
      const url = item.link || item.guid || "";
      return {
        id: Buffer.from(url).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 20),
        title: item.title?.trim() || "Untitled",
        description: (item.contentSnippet || item.summary || "").slice(0, 400),
        content: ((item as unknown as Record<string, unknown>)["content:encoded"] as string) || item.content || item.contentSnippet || "",
        url,
        imageUrl: extractImage(item as Parameters<typeof extractImage>[0]),
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
