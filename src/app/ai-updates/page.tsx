import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Calendar, ExternalLink } from "lucide-react";

// Server Component
export const revalidate = 3600; // Revalidate every hour

export default async function AIUpdatesPage() {
  const allPosts = await db.select().from(articles).orderBy(desc(articles.publishedAt));

  return (
    <main className="min-h-screen bg-[#0A0A0F] pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-sm text-gray-300">Auto-Updated Daily</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold font-display mb-4">
            AI <span className="text-brand-primary">Updates</span> Hub
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Daily curated updates from the top AI companies and the LLM ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPosts.map((post) => (
            <article
              key={post.id}
              className="glass rounded-2xl overflow-hidden group hover:border-brand-primary/30 transition-all flex flex-col"
            >
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary uppercase"
                  >
                    {post.category}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors line-clamp-2">
                  <a href={post.url} target="_blank" rel="noopener noreferrer">
                    {post.title}
                  </a>
                </h2>

                <p className="text-sm text-gray-400 mb-6 line-clamp-3 flex-grow">
                  {post.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-brand-primary hover:underline"
                  >
                    Read More <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {allPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No updates yet. Check back tomorrow!</p>
          </div>
        )}
      </div>
    </main>
  );
}
