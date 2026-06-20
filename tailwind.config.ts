import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0A0A0F",
          surface: "#1A1A2E",
          primary: "#00D4FF",
          secondary: "#B829DD",
          accent: "#FFD700",
        },
        kraft: {
          dark: "#1C1208",
          DEFAULT: "#C4956A",
          mid: "#A07040",
          deep: "#8A5C30",
          handle: "#6B3F1C",
          light: "#F5ECD7",
          muted: "#B8864E",
        },
        cream: "#FAF6F0",
      },
      fontFamily: {
        display: ["var(--font-plus-jakarta)", "var(--font-inter)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      animation: {
        pulseRing: "pulseRing 2s ease-out infinite",
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
