import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// ESLint 9 / Next.js 16 のネイティブ Flat Config 構成
const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".open-next/**",
      "out/**",
      "storybook-static/**",
      "public/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
];

export default eslintConfig;
