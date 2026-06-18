// ============================================================
//  PORTFOLIO CONFIG — single source of truth
//  Change any value here → updates across the entire site
// ============================================================

export const PORTFOLIO = {
  // ── Personal ──────────────────────────────────────────────
  name: "PakAiVerse",
  title: "AI-Powered Development Agency",
  tagline: "Engineering Digital Futures.",
  location: "Pakistan 🇵🇰 | Serving Global Clients",

  // ── Contact ───────────────────────────────────────────────
  // Change the number here → FloatingCTA, Contact, Funnel all update
  whatsapp: "923703048597",          // wa.me format (no + or spaces)
  whatsappDisplay: "+92 370 3048597",
  email: "pakaiverse@gmail.com",

  // ── Social ────────────────────────────────────────────────
  github: "https://github.com/26Adnanansari",
  linkedin: "https://linkedin.com/in/adnanansari",
  twitter: "https://twitter.com/adnanansari",

  // ── Availability badge ────────────────────────────────────
  availableForWork: true,
  availabilityText: "Accepting New Projects",
} as const;

// Helper — builds wa.me URL with optional pre-filled message
export function waLink(message?: string) {
  const base = `https://wa.me/${PORTFOLIO.whatsapp}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
