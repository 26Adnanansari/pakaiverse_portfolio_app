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
  category: "nvidia" | "openai" | "google" | "llm" | "general";
  publishedAt: string;
  author: string | null;
}

const RSS_FEEDS = {
  nvidia: [
    "https://nvidianews.nvidia.com/newsreleases.xml",
    "https://feeds.feedburner.com/nvidiablog",
  ],
  openai: [
    "https://openai.com/blog/rss.xml",
  ],
  google: [
    "https://developers.googleblog.com/feeds/posts/default",
  ],
  llm: [
    "https://huggingface.co/blog/feed.xml",
  ],
  general: [
    "https://techcrunch.com/category/artificial-intelligence/feed/",
    "https://venturebeat.com/category/ai/feed/",
  ],
};

const rssParser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "PakAiVerse-Bot/1.0",
  },
});

function extractImageFromContent(html: string): string | null {
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

export async function fetchFromRSS(
  category: keyof typeof RSS_FEEDS
): Promise<NewsArticle[]> {
  const feeds = RSS_FEEDS[category] || [];
  const fetchedArticles: NewsArticle[] = [];

  for (const feedUrl of feeds) {
    try {
      const feed = await rssParser.parseURL(feedUrl);
      
      for (const item of feed.items.slice(0, 3)) {
        if (!item.link) continue;
        
        fetchedArticles.push({
          id: Buffer.from(item.link || item.guid || "").toString("base64").slice(0, 12),
          title: item.title || "Untitled",
          description: item.contentSnippet || item.content || "",
          content: item["content:encoded"] || item.content || item.contentSnippet || "",
          url: item.link || "",
          imageUrl: extractImageFromContent(item["content:encoded"] || item.content || ""),
          source: feed.title || feedUrl,
          category,
          publishedAt: item.isoDate || new Date().toISOString(),
          author: item.creator || item.author || null,
        });
      }
    } catch (error) {
      console.warn(`RSS fetch failed for ${feedUrl}:`, error);
    }
  }

  return fetchedArticles;
}

export async function fetchAllNews(): Promise<NewsArticle[]> {
  const categories = Object.keys(RSS_FEEDS) as Array<keyof typeof RSS_FEEDS>;
  const promises = categories.map((cat) => fetchFromRSS(cat));
  const results = await Promise.all(promises);
  
  const allArticles = results.flat();

  // Remove duplicates by URL
  const seen = new Set<string>();
  const unique = allArticles.filter((a) => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });

  return unique.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function saveArticlesToDb(articlesList: NewsArticle[]) {
  let savedCount = 0;
  for (const article of articlesList) {
    try {
      // Check if exists
      const existing = await db.select().from(articles).where(eq(articles.url, article.url));
      if (existing.length === 0) {
        await db.insert(articles).values({
          id: article.id,
          title: article.title,
          description: article.description.slice(0, 500),
          content: article.content,
          url: article.url,
          imageUrl: article.imageUrl,
          source: article.source,
          category: article.category,
          publishedAt: new Date(article.publishedAt),
          author: article.author,
        });
        savedCount++;
      }
    } catch (e) {
      console.error("Error saving article:", article.title, e);
    }
  }
  return savedCount;
}
