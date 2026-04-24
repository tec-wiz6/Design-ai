import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        clash: ["var(--font-clash)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      colors: {
        bg:      "#080808",
        surface: "#101010",
        s2:      "#181818",
        s3:      "#222222",
        border:  "#2a2a2a",
        b2:      "#333333",
        lime:    "#c6f135",
        gold:    "#f5c842",
        muted:   "#555555",
        muted2:  "#3a3a3a",
        text:    "#f2f2f2",
        sub:     "#888888",
      },
      animation: {
        "fade-up":  "fadeUp 0.4s ease-out both",
        "fade-in":  "fadeIn 0.3s ease-out both",
        "bar":      "bar 1.4s ease-in-out infinite",
        "glow-pulse":"glowPulse 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:    { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn:    { from: { opacity: "0" }, to: { opacity: "1" } },
        bar:       { "0%": { width: "0%", marginLeft: "0" }, "50%": { width: "55%", marginLeft: "20%" }, "100%": { width: "0%", marginLeft: "100%" } },
        glowPulse: { "0%,100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
      },
    },
  },
  plugins: [],
};
export default config;
