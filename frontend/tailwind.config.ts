import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";
export default withUt({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/containers/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7367F0",
        secondary: "#3F3D56",
        grayDarkest: "#131316",
        grayDarker: "#212126",
        grayDark: "#9394A1",
        "primary-dark": "#4A46B8",
      },

      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        montserrat: ["var(--font-montserrat)"],
        poppins: ["var(--font-poppins)"],
      },
    },
    container: {
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "4rem",
        "2xl": "6rem",
      },
      center: true,
    },
  },

  darkMode: "class",
  plugins: [heroui()],
}) satisfies Config;
