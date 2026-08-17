import { notFound } from "next/navigation";
import { Metadata } from "next";
import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import FloatingCTA from "@/components/portfolio/FloatingCTA";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: { slug: string };
}

const BASE_URL = "https://pakaiverse.com";

/** Strip HTML tags and normalize whitespace for clean meta descriptions */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Estimate reading time */
function readingTime(html: string): string {
  const words = stripHtml(html).split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await db
    .select()
    .from(blogs)
    .where(eq(blogs.slug, params.slug))
    .limit(1);

  if (!post || post.length === 0) {
    return { title: "Post Not Found | PakAiVerse Blog" };
  }

  const blog = post[0];
  const postUrl = `${BASE_URL}/blog/${blog.slug}`;
  const cleanDescription = blog.content
    ? stripHtml(blog.content).substring(0, 155) + "..."
    : "Read this insightful article on web development and AI at PakAiVerse.";

  const ogImage = blog.coverImage
    ? [{ url: blog.coverImage, width: 1200, height: 630, alt: blog.title }]
    : [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: "PakAiVerse" }];

  return {
    title: `${blog.title} | PakAiVerse Blog`,
    description: cleanDescription,
    authors: [{ name: blog.author || "Adnan Ansari", url: BASE_URL }],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: blog.title,
      description: cleanDescription,
      url: postUrl,
      type: "article",
      siteName: "PakAiVerse Blog",
      publishedTime: blog.createdAt ? blog.createdAt.toISOString() : undefined,
      modifiedTime: blog.updatedAt ? blog.updatedAt.toISOString() : undefined,
      authors: [blog.author || "Adnan Ansari"],
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: cleanDescription,
      creator: "@pakaiverse",
      site: "@pakaiverse",
      images: blog.coverImage ? [blog.coverImage] : [`${BASE_URL}/og-image.png`],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const postResult = await db
    .select()
    .from(blogs)
    .where(eq(blogs.slug, params.slug))
    .limit(1);

  if (!postResult || postResult.length === 0 || !postResult[0].published) {
    notFound();
  }

  const post = postResult[0];
  const postUrl = `${BASE_URL}/blog/${post.slug}`;
  const cleanDescription = post.content
    ? stripHtml(post.content).substring(0, 155) + "..."
    : "Read this article on PakAiVerse.";
  const timeToRead = post.content ? readingTime(post.content) : "2 min read";

  // ─── Article JSON-LD ────────────────────────────────────────────────────────
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": postUrl,
    headline: post.title,
    description: cleanDescription,
    url: postUrl,
    datePublished: post.createdAt ? post.createdAt.toISOString() : undefined,
    dateModified: post.updatedAt
      ? post.updatedAt.toISOString()
      : post.createdAt
      ? post.createdAt.toISOString()
      : undefined,
    author: {
      "@type": "Person",
      name: post.author || "Adnan Ansari",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "PakAiVerse",
      "@id": `${BASE_URL}/#organization`,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/projects/Main-logo.png`,
      },
    },
    image: post.coverImage
      ? { "@type": "ImageObject", url: post.coverImage, width: 1200, height: 630 }
      : { "@type": "ImageObject", url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    isPartOf: {
      "@type": "Blog",
      name: "PakAiVerse Blog",
      url: `${BASE_URL}/blog`,
    },
    inLanguage: "en-US",
    keywords: "web development, AI, SaaS, Next.js, PakAiVerse",
  };

  // ─── BreadcrumbList JSON-LD ─────────────────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${BASE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-brand-primary/5 blur-[120px] -z-10" />

        <article
          className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10"
          itemScope
          itemType="https://schema.org/Article"
        >
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs text-slate-500">
              <li>
                <Link href="/" className="hover:text-brand-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog" className="hover:text-brand-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>/</li>
              <li className="text-slate-400 truncate max-w-[200px]">{post.title}</li>
            </ol>
          </nav>

          <Link
            href="/blog"
            className="inline-flex items-center text-brand-primary hover:text-white transition-colors mb-12 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all articles
          </Link>

          <header className="mb-12">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight"
              itemProp="headline"
            >
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold">
                  {post.author ? post.author[0].toUpperCase() : "A"}
                </div>
                <span className="font-medium text-white" itemProp="author">
                  {post.author || "Adnan Ansari"}
                </span>
              </div>
              <span>•</span>
              <time
                dateTime={post.createdAt ? post.createdAt.toISOString() : undefined}
                itemProp="datePublished"
              >
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recently Published"}
              </time>
              <span>•</span>
              <span>{timeToRead}</span>
            </div>
          </header>

          {post.coverImage && (
            <div className="w-full aspect-[21/9] relative rounded-2xl overflow-hidden mb-16 border border-white/10 shadow-2xl shadow-brand-primary/5">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                itemProp="image"
              />
            </div>
          )}

          <div
            className="prose prose-invert prose-brand max-w-none prose-img:rounded-xl prose-img:border prose-img:border-white/10 prose-headings:font-display prose-a:text-brand-primary hover:prose-a:text-brand-secondary transition-colors"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
            itemProp="articleBody"
          />
        </article>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
