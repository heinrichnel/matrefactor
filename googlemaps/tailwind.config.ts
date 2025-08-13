import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Targets all TSX files
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6", // Custom color
        secondary: "#10B981",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // Optional plugins
    require("@tailwindcss/forms"),
  ],
} satisfies Config;
