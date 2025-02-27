import {heroui} from '@heroui/theme';
import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(modal|scroll-shadow).js"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [nextui({
      themes: {
        light: {
          // ...
          colors: {
            primary: {
              DEFAULT: "#21A691"
            }
          },},dark: {
          // ...
          colors: {},},// ... custom themes
      },}),heroui()],
} satisfies Config;
