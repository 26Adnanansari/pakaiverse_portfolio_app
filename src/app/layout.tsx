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
    default: "PakAiVerse | AI-Powered Development Agency",
    template: "%s | PakAiVerse",
  },
  description: "PakAiVerse builds scalable web apps, SaaS platforms, and AI integrations. Guest posting and SEO services for tech businesses.",
  keywords: ["AI development", "Next.js agency", "guest posting", "SaaS development", "Pakistan tech agency", "Web Development"],
  authors: [{ name: "Adnan Ansari" }],
  creator: "PakAiVerse",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pakaiverse.com",
    siteName: "PakAiVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "PakAiVerse | AI-Powered Development Agency",
    description: "Build scalable web apps with autonomous AI agents",
    creator: "@pakaiverse",
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
  return (
    <html lang="en" className={`overflow-x-clip ${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen w-full overflow-x-clip text-slate-300 antialiased selection:bg-brand-primary/30 bg-[#0A0A0F]">
        {children}
      </body>
    </html>
  );
}
