import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import FloatingCTA from "@/components/portfolio/FloatingCTA";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Blog | PakAiVerse - AI & Development Insights",
  description: "Read the latest insights on AI development, web scaling, SaaS building, and guest posting from PakAiVerse.",
};

export const revalidate = 0; // Force dynamic rendering

export default async function BlogListingPage() {
  const publishedBlogs = await db
    .select()
    .from(blogs)
    .where(eq(blogs.published, true))
    .orderBy(desc(blogs.createdAt));

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 inset-x-0 h-64 bg-brand-primary/5 blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Insights</span> & Updates
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Dive deep into our latest thoughts on AI automation, high-performance web development, and digital scaling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedBlogs.map((post) => (
              <Link 
                href={`/blog/${post.slug}`} 
                key={post.id}
                className="group relative bg-[#151520] rounded-2xl overflow-hidden border border-white/5 hover:border-brand-primary/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[16/9] w-full bg-slate-800 relative overflow-hidden">
                  {post.coverImage ? (
                    <Image 
                      src={post.coverImage} 
                      alt={post.title} 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center">
                      <span className="text-brand-primary/50 text-4xl font-display font-bold">PAIV</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-brand-primary font-medium mb-3">
                    <span>{post.author || "Adnan Ansari"}</span>
                    <span>•</span>
                    <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <div className="text-slate-400 text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: post.content ? post.content.substring(0, 150) + '...' : '' }} />
                </div>
              </Link>
            ))}
          </div>

          {publishedBlogs.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              No blog posts published yet. Check back soon!
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
