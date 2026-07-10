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
        // NOTE: かつて記事一覧等で使っていた fadeInAnime(animate-fadeIn)は削除済み。
        // ルート遷移で再マウントされる要素に入場フェードを付けると、View Transitionの
        // スナップショットがopacity:0で撮られ遷移のたびにちらつくため再導入しないこと
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-4px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
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
        // primaryの濃色版。白背景の文字色/白文字の背景色として使ってもWCAG AA(4.5:1)を満たす
        // (白との比 約6.1:1)。primary(3.79:1)・secondary(2.71:1)はAA未達のため、
        // コントラストが必要な箇所ではこちらを使うこと
        "primary-deep": "#1F6B76",
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
