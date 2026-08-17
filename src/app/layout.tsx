import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const BASE_URL = "https://pakaiverse.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "PakAiVerse | Affordable Web & AI Development Agency — USA, UK & Canada",
    template: "%s | PakAiVerse",
  },
  description:
    "Hire senior Next.js & AI developers at startup-friendly rates. We build custom web apps, SaaS platforms, and e-commerce stores for businesses in USA, UK & Canada. 50+ projects delivered. Starting from $100.",
  keywords: [
    "affordable web development agency",
    "hire Next.js developer",
    "SaaS development company",
    "custom web app development USA",
    "AI web development agency",
    "offshore web development USA UK Canada",
    "remote web developer for hire",
    "e-commerce development agency",
    "Next.js agency",
    "AI integration development",
    "web development Pakistan",
    "cheap web development agency",
    "web development for startups",
    "full stack developer for hire",
    "PakAiVerse",
    "Adnan Ansari developer",
  ],
  authors: [{ name: "Adnan Ansari", url: "https://pakaiverse.com" }],
  creator: "PakAiVerse",
  publisher: "PakAiVerse",
  category: "Technology",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["en_GB", "en_CA", "en_AU"],
    url: BASE_URL,
    siteName: "PakAiVerse",
    title: "PakAiVerse | Affordable Web & AI Development — USA, UK & Canada",
    description:
      "Senior-level web apps, SaaS & AI development at startup-friendly rates. Trusted by clients in USA, UK & Canada.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "PakAiVerse - Affordable AI-Powered Development Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PakAiVerse | Affordable Web & AI Development Agency",
    description:
      "Senior Next.js & AI development at startup-friendly rates for USA, UK & Canada.",
    creator: "@pakaiverse",
    site: "@pakaiverse",
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add Google Search Console verification key here when available
    // google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ─── Organization Schema ───────────────────────────────────────────────────
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "PakAiVerse",
    alternateName: ["Pak AI Verse", "PakAiVerse Agency"],
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/projects/Main-logo.png`,
      width: 400,
      height: 400,
    },
    image: `${BASE_URL}/og-image.png`,
    description:
      "Affordable web development agency specializing in Next.js, SaaS, and AI integration for businesses in USA, UK, Canada, and Australia.",
    foundingDate: "2022",
    founder: {
      "@type": "Person",
      "@id": `${BASE_URL}/#adnan`,
      name: "Adnan Ansari",
    },
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "Australia" },
      { "@type": "Country", name: "Pakistan" },
    ],
    knowsAbout: [
      "Web Development",
      "SaaS Development",
      "AI Integration",
      "E-commerce Development",
      "Next.js",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Search Engine Optimization",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web & AI Development Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Web App Development", description: "High-performance web applications built with Next.js and React starting from $300." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "SaaS Platform Development", description: "Scalable SaaS products with auth, billing, and admin dashboards starting from $500." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "E-commerce Development", description: "Full-featured online stores with payment integration starting from $200." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Integration", description: "Integrate Gemini, OpenAI, and custom AI models into your existing apps." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEO Services", description: "Technical SEO, content strategy, and performance optimization starting from $50/month." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Landing Page Design", description: "High-converting landing pages starting from $100." } },
      ],
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "pakaiverse@gmail.com",
      contactType: "customer service",
      availableLanguage: ["English", "Urdu"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "22:00",
      },
    },
    sameAs: [
      "https://github.com/26Adnanansari",
      "https://linkedin.com/in/adnan-ansari-dev",
      "https://twitter.com/pakaiverse",
    ],
    priceRange: "$100 - $5000",
    currenciesAccepted: "USD",
    paymentAccepted: "Credit Card, Bank Transfer, PayPal",
  };

  // ─── Person Schema (Adnan Ansari) ──────────────────────────────────────────
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#adnan`,
    name: "Adnan Ansari",
    givenName: "Adnan",
    familyName: "Ansari",
    jobTitle: "Founder & Lead Engineer",
    worksFor: { "@id": `${BASE_URL}/#organization` },
    url: BASE_URL,
    image: `${BASE_URL}/og-image.png`,
    description:
      "Full-stack architect and AI developer. Founder of PakAiVerse, specializing in Next.js, SaaS, and AI integration for clients in USA, UK, and Canada.",
    knowsAbout: ["Next.js", "React", "TypeScript", "AI Development", "SaaS", "PostgreSQL", "Cloud Architecture"],
    sameAs: [
      "https://github.com/26Adnanansari",
      "https://linkedin.com/in/adnan-ansari-dev",
    ],
  };

  // ─── WebSite Schema (Sitelinks search box) ────────────────────────────────
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: "PakAiVerse",
    url: BASE_URL,
    description: "Affordable Next.js & AI development agency for startups and businesses.",
    publisher: { "@id": `${BASE_URL}/#organization` },
    inLanguage: "en-US",
  };

  return (
    <html
      lang="en"
      className={`overflow-x-clip ${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* ── Canonical & Alternates ───────────────────────────────── */}
        <link rel="canonical" href={BASE_URL} />

        {/* ── GEO Meta Tags (Geographic SEO) ───────────────────────── */}
        {/* Primary location: Pakistan (where we are based) */}
        <meta name="geo.region" content="PK" />
        <meta name="geo.placename" content="Pakistan" />
        <meta name="geo.position" content="30.3753;69.3451" />
        <meta name="ICBM" content="30.3753, 69.3451" />

        {/* ── AI / LLM Crawler Hints (GEO — Generative Engine Optimization) ── */}
        {/* Allow GPTBot (ChatGPT), Anthropic, Perplexity, Google Gemini to index */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

        {/* ── JSON-LD Structured Data ───────────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen w-full overflow-x-clip text-slate-300 antialiased selection:bg-brand-primary/30 bg-[#0A0A0F]">
        {children}
      </body>
    </html>
  );
}
