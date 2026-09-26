/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Green-on-black portfolio palette. Each pair is
        // { light-mode value, "-dark" variant for dark mode }.
        // CHANGE ME: swap these hexes for your own brand colors.
        bg: { DEFAULT: "#10160f", dark: "#10160f" },
        surface: { DEFAULT: "#ffffff", dark: "#10160f" },
        surface2: { DEFAULT: "#eef2ea", dark: "#141b13" },
        ink: { DEFAULT: "#ffffff", dark: "#eef5ee" },
        dim: { DEFAULT: "#576853", dark: "#93a692" },
        accent: { DEFAULT: "#1f8a4c", dark: "#5fd98a" },
        accentStrong: { DEFAULT: "#136336", dark: "#8ef0ac" },
        line: { DEFAULT: "#dce6d9", dark: "#213024" },
        easy: { DEFAULT: "#1f8a4c", dark: "#5fd98a" },
        medium: { DEFAULT: "#a9720b", dark: "#e0b34d" },
        hard: { DEFAULT: "#c1432e", dark: "#f0796a" },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ['"Work Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
