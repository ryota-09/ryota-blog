import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// ESLint 9 / Next.js 16 のネイティブ Flat Config 構成
const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".open-next/**",
      ".claude/**",
      ".superset/**",
      "out/**",
      "storybook-static/**",
      "public/**",
      "webvitals/**",
      "src/static/rss/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  {
    // eslint-config-next@16 が新たに有効化する React Compiler 系の厳格ルールは、
    // 既存コードの意図的なパターン（マウント時のlocalStorage読込→setState 等）を多くエラー化するため、
    // CIゲートを赤にしないよう warning に緩和する（検知は残す）。
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
    },
  },
];

export default eslintConfig;
