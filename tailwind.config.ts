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
        // These use CSS variable RGB triplets so opacity utilities (bg-obsidian/80 etc) work
        obsidian:   "rgb(var(--c-bg)       / <alpha-value>)",
        charcoal:   "rgb(var(--c-surface)  / <alpha-value>)",
        "deep-gray":"rgb(var(--c-surface2) / <alpha-value>)",
        "mid-gray": "rgb(var(--c-surface3) / <alpha-value>)",
        "soft-white":"rgb(var(--c-text)    / <alpha-value>)",
        silver:     "rgb(var(--c-muted)    / <alpha-value>)",
        // Fixed accent colours — same in both themes
        "glow-blue":   "#4fc3f7",
        "glow-pink":   "#e040fb",
        "glow-purple": "#9c6aff",
        "muted-amber": "#c8a96e",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
