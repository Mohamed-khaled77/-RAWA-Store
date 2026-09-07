import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F9FAFB",
        surface: "#FFFFFF",
        ink: "#111827",
        "ink-light": "#4B5563",
        girls: "#D81B60", // Vivid Pink (Darker)
        boys: "#0284C7",  // Strong Blue (Darker)
        neutral: "#000000", // Neutral
        border: "#E5E7EB",
      },
      fontFamily: {
        display: ["var(--font-lalezar)"],
        body: ["var(--font-tajawal)"],
      },
    },
  },
  plugins: [],
};

export default config;
