import type { Metadata } from "next";
import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import FloatingCTA from "@/components/portfolio/FloatingCTA";
import FAQSection from "@/components/portfolio/FAQSection";
import Link from "next/link";

const BASE_URL = "https://pakaiverse.com";

export const metadata: Metadata = {
  title: "FAQ — Web & AI Development Questions | PakAiVerse",
  description:
    "Frequently asked questions about PakAiVerse web and AI development services — pricing, timelines, tech stack, SaaS, e-commerce, AI integration, and support for USA, UK & Canada.",
  keywords: [
    "web development FAQ",
    "how much does web development cost",
    "how long to build a website",
    "affordable SaaS development",
    "AI integration cost",
    "Next.js developer hire",
    "PakAiVerse FAQ",
  ],
  alternates: {
    canonical: `${BASE_URL}/faq`,
  },
  openGraph: {
    type: "website",
    title: "FAQ — Web & AI Development Questions | PakAiVerse",
    description:
      "Everything you need to know about PakAiVerse services — pricing, timeline, tech stack, and support.",
    url: `${BASE_URL}/faq`,
    siteName: "PakAiVerse",
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: "PakAiVerse FAQ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ — Web & AI Development Questions | PakAiVerse",
    description: "Everything you need to know about PakAiVerse services — pricing, timeline, tech stack.",
    site: "@pakaiverse",
  },
};

export default function FAQPage() {
  // ─── BreadcrumbList JSON-LD ─────────────────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "FAQ", item: `${BASE_URL}/faq` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      <main className="min-h-screen pt-32 pb-10 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 inset-x-0 h-64 bg-brand-primary/5 blur-[120px] -z-10" />

        {/* Breadcrumb */}
        <div className="max-w-3xl mx-auto px-6 lg:px-8 mb-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-slate-500">
              <li>
                <Link href="/" className="hover:text-brand-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-slate-400">FAQ</li>
            </ol>
          </nav>
        </div>

        {/* FAQ Section reused */}
        <FAQSection />

        {/* Back to home */}
        <div className="text-center pb-8">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-brand-primary transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
