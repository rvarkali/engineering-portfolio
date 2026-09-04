import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        portfolio: {
          bg: "#ffffff",
          surface: "#f7f9fc",
          atmosphere: "#eff5ff",
          ink: "#071126",
          body: "#34445e",
          muted: "#687792",
          accent: "#1769ff",
          border: "#d7e1ef",
          navy: "#071126"
        },
        ink: {
          950: "#070a12",
          900: "#0b1020",
          800: "#121a2b",
          700: "#1a263b"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        "soft-border": "0 0 0 1px rgba(148, 163, 184, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
