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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await db.select().from(blogs).where(eq(blogs.slug, params.slug)).limit(1);
  
  if (!post || post.length === 0) {
    return { title: "Post Not Found | PakAiVerse" };
  }

  const blog = post[0];
  const baseUrl = "https://www.pakaiverse.com";

  return {
    title: `${blog.title} | PakAiVerse Blog`,
    description: blog.content ? blog.content.replace(/<[^>]+>/g, '').substring(0, 160) : "Read this article on PakAiVerse.",
    openGraph: {
      title: blog.title,
      description: blog.content ? blog.content.replace(/<[^>]+>/g, '').substring(0, 160) : "Read this article on PakAiVerse.",
      url: `${baseUrl}/blog/${blog.slug}`,
      type: "article",
      publishedTime: blog.createdAt ? blog.createdAt.toISOString() : undefined,
      authors: [blog.author || "Adnan Ansari"],
      images: blog.coverImage ? [
        {
          url: blog.coverImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        }
      ] : [
        {
          url: `${baseUrl}/projects/Main-logo.png`,
          width: 1200,
          height: 630,
          alt: "PakAiVerse",
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.content ? blog.content.replace(/<[^>]+>/g, '').substring(0, 160) : "Read this article on PakAiVerse.",
      images: blog.coverImage ? [blog.coverImage] : [`${baseUrl}/projects/Main-logo.png`],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const postResult = await db.select().from(blogs).where(eq(blogs.slug, params.slug)).limit(1);

  if (!postResult || postResult.length === 0 || !postResult[0].published) {
    notFound();
  }

  const post = postResult[0];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-brand-primary/5 blur-[120px] -z-10" />
        
        <article className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-brand-primary hover:text-white transition-colors mb-12 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all articles
          </Link>

          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold">
                  {post.author ? post.author[0].toUpperCase() : 'A'}
                </div>
                <span className="font-medium text-white">{post.author || "Adnan Ansari"}</span>
              </div>
              <span>•</span>
              <time dateTime={post.createdAt ? post.createdAt.toISOString() : undefined}>
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }) : 'Recently Published'}
              </time>
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
              />
            </div>
          )}

          <div 
            className="prose prose-invert prose-brand max-w-none prose-img:rounded-xl prose-img:border prose-img:border-white/10 prose-headings:font-display prose-a:text-brand-primary hover:prose-a:text-brand-secondary transition-colors"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </article>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
