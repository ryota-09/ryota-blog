import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInAnime: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fadeIn': 'fadeInAnime 1s forwards',
      },
      textUnderlineOffset: {
        "highlight": '-0.2em',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "primary": "#2F8F9D",
        "secondary": "#3BACB6",
        "base-color": "#82DBD8",
        "light": "#B3E8E5",
        "zenn": "#3ea8ff",
        "txt-base": "#383838"
      },
    }
  },
  plugins: [],
};
export default config;
