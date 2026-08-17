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

export const metadata: Metadata = {
  metadataBase: new URL("https://pakaiverse.com"),
  title: {
    default: "PakAiVerse | Affordable Web & AI Development Agency — USA, UK & Canada",
    template: "%s | PakAiVerse",
  },
  description: "Hire senior Next.js & AI developers at startup-friendly rates. We build custom web apps, SaaS platforms, and e-commerce stores for businesses in USA, UK & Canada. 50+ projects delivered. Starting from $100.",
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
  ],
  authors: [{ name: "Adnan Ansari" }],
  creator: "PakAiVerse",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pakaiverse.com",
    siteName: "PakAiVerse",
    title: "PakAiVerse | Affordable Web & AI Development — USA, UK & Canada",
    description: "Senior-level web apps, SaaS & AI development at startup-friendly rates. Trusted by clients in USA, UK & Canada.",
    images: [{
      url: "https://pakaiverse.com/og-image.png",
      width: 1200,
      height: 630,
      alt: "PakAiVerse - Affordable AI-Powered Development Agency",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PakAiVerse | Affordable Web & AI Development Agency",
    description: "Senior Next.js & AI development at startup-friendly rates for USA, UK & Canada.",
    creator: "@pakaiverse",
    images: ["https://pakaiverse.com/og-image.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PakAiVerse",
    url: "https://pakaiverse.com",
    logo: "https://pakaiverse.com/og-image.png",
    description: "Affordable web development agency specializing in Next.js, SaaS, and AI integration for businesses in USA, UK, and Canada.",
    founder: { "@type": "Person", name: "Adnan Ansari" },
    areaServed: ["US", "GB", "CA", "PK"],
    serviceType: ["Web Development", "SaaS Development", "AI Integration", "E-commerce", "SEO"],
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@pakaiverse.com",
      contactType: "customer service",
      availableLanguage: "English",
    },
    sameAs: [
      "https://github.com/26Adnanansari",
    ],
  };

  return (
    <html lang="en" className={`overflow-x-clip ${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen w-full overflow-x-clip text-slate-300 antialiased selection:bg-brand-primary/30 bg-[#0A0A0F]">
        {children}
      </body>
    </html>
  );
}
