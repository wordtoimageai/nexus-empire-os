import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        border: "var(--border)",
        "border-subtle": "var(--border-subtle)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
    },
  },
  plugins: [],
};

export default config;
