import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)","./*.mdx"],

  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-mdx-gfm"
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  docs: {},

  staticDirs: ["../public"],
  typescript: {
    reactDocgen: "react-docgen-typescript"
  },
  // tsconfigのpaths(@/*)とNext.jsモジュールをViteで解決するためのエイリアス設定
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../src"),
      // Next.jsモジュールのモック（Vite環境では動作しないため）
      "next/image": path.resolve(__dirname, "./mocks/next-image.tsx"),
      "next/link": path.resolve(__dirname, "./mocks/next-link.tsx"),
    };
    return config;
  },
};
export default config;