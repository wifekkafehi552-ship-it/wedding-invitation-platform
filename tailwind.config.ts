import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F6F1E7",
        ink: "#1E1A16",
        gold: "#B8935A",
        champagne: "#E7D9BE",
        burgundy: "#5B1F23",
      },
      fontFamily: {
        arefRuqaa: ["'Aref Ruqaa'", "serif"],
        cairo: ["Cairo", "sans-serif"],
        cormorant: ["'Cormorant Garamond'", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
