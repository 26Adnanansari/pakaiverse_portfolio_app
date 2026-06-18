import { NextResponse } from "next/server";
import { fetchAllNews, saveArticlesToDb } from "@/lib/news-fetcher";

// Force dynamic so Next.js does not try to pre-render this route at build time
export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET;


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Starting daily news fetch...");
    
    const articles = await fetchAllNews();
    console.log(`Fetched ${articles.length} articles`);

    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    const freshArticles = articles.filter(
      (a) => new Date(a.publishedAt) > oneDayAgo
    );

    const savedCount = await saveArticlesToDb(freshArticles);

    return NextResponse.json({
      success: true,
      fetched: articles.length,
      saved: savedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Daily news fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch news", details: String(error) },
      { status: 500 }
    );
  }
}
