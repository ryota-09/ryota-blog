import type { Meta, StoryObj } from "@storybook/react";
import Tweet from ".";

// NOTE: react-tweetはTwitter/X本体への実ネットワークフェッチが必要なため、
// Storybookのビルド環境(CIサンドボックス等)ではCORS/ネットワーク制限により
// 正しく描画できない場合がある(既存のTwitterCardにもstoryが無いのは同様の事情による)。
// それでもコンポーネントの疎通確認用に最小限のstoryを用意しておく。
const meta = {
  title: "ArticleBody/Embeds/Tweet",
  component: Tweet,
  tags: ["autodocs"],
} satisfies Meta<typeof Tweet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "1921873332732825894",
    url: "https://twitter.com/Ryo54388667/status/1921873332732825894",
  },
};
