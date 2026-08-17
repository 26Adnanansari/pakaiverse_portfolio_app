import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import FloatingCTA from "@/components/portfolio/FloatingCTA";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

const BASE_URL = "https://pakaiverse.com";

export const metadata: Metadata = {
  title: "Blog | PakAiVerse — AI, Web Dev & SaaS Insights",
  description:
    "Read expert articles on AI development, Next.js, SaaS architecture, e-commerce, SEO, and digital scaling from PakAiVerse — a leading affordable web agency.",
  keywords: [
    "AI development blog",
    "Next.js tutorials",
    "SaaS development tips",
    "web development insights",
    "PakAiVerse blog",
    "software agency blog",
  ],
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    type: "website",
    title: "Blog | PakAiVerse — AI, Web Dev & SaaS Insights",
    description:
      "Expert articles on AI, Next.js, SaaS, and digital scaling from PakAiVerse.",
    url: `${BASE_URL}/blog`,
    siteName: "PakAiVerse",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "PakAiVerse Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | PakAiVerse — AI, Web Dev & SaaS Insights",
    description: "Expert articles on AI, Next.js, SaaS, and digital scaling from PakAiVerse.",
    site: "@pakaiverse",
  },
};

export const revalidate = 60;

export default async function BlogListingPage() {
  const publishedBlogs = await db
    .select()
    .from(blogs)
    .where(eq(blogs.published, true))
    .orderBy(desc(blogs.createdAt));

  // ─── CollectionPage JSON-LD ─────────────────────────────────────────────────
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/blog`,
    name: "PakAiVerse Blog",
    description:
      "Expert articles on AI development, Next.js, SaaS, e-commerce, and digital scaling.",
    url: `${BASE_URL}/blog`,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: "PakAiVerse",
      "@id": `${BASE_URL}/#organization`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 inset-x-0 h-64 bg-brand-primary/5 blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs text-slate-500">
              <li>
                <Link href="/" className="hover:text-brand-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-slate-400">Blog</li>
            </ol>
          </nav>

          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                Insights
              </span>{" "}
              &amp; Updates
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Dive deep into our latest thoughts on AI automation, high-performance web
              development, and digital scaling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedBlogs.map((post) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post.id}
                className="group relative bg-[#151520] rounded-2xl overflow-hidden border border-white/5 hover:border-brand-primary/30 transition-all duration-300 hover:-translate-y-1"
                aria-label={`Read article: ${post.title}`}
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
                      <span className="text-brand-primary/50 text-4xl font-display font-bold">
                        PAIV
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-brand-primary font-medium mb-3">
                    <span>{post.author || "Adnan Ansari"}</span>
                    <span>•</span>
                    <time
                      dateTime={
                        post.createdAt ? post.createdAt.toISOString() : undefined
                      }
                    >
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </time>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-slate-400 text-sm line-clamp-3">
                    {post.content
                      ? post.content
                          .replace(/<[^>]+>/g, " ")
                          .replace(/\s+/g, " ")
                          .trim()
                          .substring(0, 140) + "..."
                      : ""}
                  </p>
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
