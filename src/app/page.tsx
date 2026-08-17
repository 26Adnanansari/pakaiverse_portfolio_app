import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import GoogleSignInInfo from "@/components/portfolio/GoogleSignInInfo";
import Projects from "@/components/portfolio/Projects";
import FeaturedSaaS from "@/components/portfolio/FeaturedSaaS";
import BentoServices from "@/components/portfolio/BentoServices";
import ProcessTimeline from "@/components/portfolio/ProcessTimeline";
import AboutFounder from "@/components/portfolio/AboutFounder";
import FunnelSection from "@/components/portfolio/FunnelSection";
import FAQSection from "@/components/portfolio/FAQSection";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";
import FloatingCTA from "@/components/portfolio/FloatingCTA";
import ChatBot from "@/components/portfolio/ChatBot";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc } from "drizzle-orm";
import type { Metadata } from "next";

export const revalidate = 60;

const BASE_URL = "https://pakaiverse.com";

export const metadata: Metadata = {
  title: "PakAiVerse | Affordable Web & AI Development Agency — USA, UK & Canada",
  description:
    "Hire senior Next.js & AI developers at startup-friendly rates. We build custom web apps, SaaS platforms, and e-commerce stores for businesses in USA, UK & Canada. 50+ projects delivered. Starting from $100.",
  alternates: {
    canonical: BASE_URL,
  },
};

export default async function Home() {
  const dbProjects = await db.select().from(projects).orderBy(desc(projects.createdAt));

  // ─── WebPage JSON-LD ───────────────────────────────────────────────────────
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE_URL}/#webpage`,
    url: BASE_URL,
    name: "PakAiVerse — Affordable Web & AI Development Agency",
    description:
      "Senior-level web apps, SaaS & AI development at startup-friendly rates for USA, UK & Canada businesses.",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "ReadAction",
      target: [BASE_URL],
    },
  };

  // ─── Service Schema (individual services for AEO) ─────────────────────────
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PakAiVerse Development Services",
    url: BASE_URL,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Service",
          name: "Custom Web App Development",
          provider: { "@id": `${BASE_URL}/#organization` },
          description: "High-performance Next.js web applications built for startups and businesses in USA, UK, Canada. Starting from $300.",
          offers: { "@type": "Offer", price: "300", priceCurrency: "USD", priceSpecification: { "@type": "PriceSpecification", minPrice: "300", maxPrice: "2000", priceCurrency: "USD" } },
          areaServed: ["US", "GB", "CA", "AU"],
          url: BASE_URL,
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Service",
          name: "SaaS Platform Development",
          provider: { "@id": `${BASE_URL}/#organization` },
          description: "Scalable SaaS products with authentication, Stripe billing, multi-tenancy, and admin dashboards. Starting from $500.",
          offers: { "@type": "Offer", price: "500", priceCurrency: "USD", priceSpecification: { "@type": "PriceSpecification", minPrice: "500", maxPrice: "5000", priceCurrency: "USD" } },
          areaServed: ["US", "GB", "CA", "AU"],
          url: BASE_URL,
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Service",
          name: "AI Integration Services",
          provider: { "@id": `${BASE_URL}/#organization` },
          description: "Integrate Google Gemini, OpenAI GPT, and custom AI models into web apps. AI chatbots, automation, content generation.",
          areaServed: ["US", "GB", "CA", "AU"],
          url: BASE_URL,
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "Service",
          name: "E-commerce Development",
          provider: { "@id": `${BASE_URL}/#organization` },
          description: "Full-featured e-commerce stores with Stripe payments, product management, and admin dashboards. Starting from $200.",
          offers: { "@type": "Offer", price: "200", priceCurrency: "USD" },
          areaServed: ["US", "GB", "CA", "AU"],
          url: BASE_URL,
        },
      },
      {
        "@type": "ListItem",
        position: 5,
        item: {
          "@type": "Service",
          name: "SEO Optimization",
          provider: { "@id": `${BASE_URL}/#organization` },
          description: "Technical SEO, structured data, Core Web Vitals optimization, and content strategy. Starting from $50/month.",
          offers: { "@type": "Offer", price: "50", priceCurrency: "USD" },
          areaServed: ["US", "GB", "CA", "AU"],
          url: BASE_URL,
        },
      },
      {
        "@type": "ListItem",
        position: 6,
        item: {
          "@type": "Service",
          name: "Landing Page Design",
          provider: { "@id": `${BASE_URL}/#organization` },
          description: "High-converting, responsive landing pages with modern UI. Starting from $100.",
          offers: { "@type": "Offer", price: "100", priceCurrency: "USD" },
          areaServed: ["US", "GB", "CA", "AU"],
          url: BASE_URL,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <Navbar />
      <main>
        <Hero />
        <GoogleSignInInfo />
        <FeaturedSaaS />
        <Projects dbProjects={dbProjects} />
        <BentoServices />
        <ProcessTimeline />
        <AboutFounder />
        <FunnelSection />
        <FAQSection />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
      <ChatBot />
    </>
  );
}
