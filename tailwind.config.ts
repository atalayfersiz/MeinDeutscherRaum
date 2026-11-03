import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{json,md}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FAF9F5",
          100: "#F4F1EA",
          200: "#E8E4DA",
          300: "#D6D0C2",
          800: "#22211E",
          900: "#141412",
          950: "#0D0D0B",
        },
        gender: {
          der: "#2563eb",
          die: "#dc2626",
          das: "#059669",
          pl: "#7c3aed",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          '"SFMono-Regular"',
          "Consolas",
          '"Liberation Mono"',
          "Menlo",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
