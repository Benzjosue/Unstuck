import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          slate: "#2C3E50",
          teal: "#3D7A8A",
          "teal-light": "#EAF4F6",
          warm: "#E07A5F",
          "warm-light": "#FDF0ED",
          mist: "#F4F6F7",
          mid: "#7F8C8D",
          border: "#E5E7EB",
        },
      },
    },
  },
  plugins: [],
};
export default config;
