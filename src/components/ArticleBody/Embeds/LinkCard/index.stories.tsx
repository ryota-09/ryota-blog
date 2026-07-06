import type { Meta, StoryObj } from "@storybook/react";
import LinkCard from ".";

const meta = {
  title: "ArticleBody/Embeds/LinkCard",
  component: LinkCard,
  tags: ["autodocs"],
} satisfies Meta<typeof LinkCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// content/ogp-cache.jsonにキャッシュがあるURL(OGP画像・説明が表示される)
export const Cached: Story = {
  args: {
    url: "https://zenn.dev/ryota_09/articles/06ec306f0ef9ee",
  },
};

// キャッシュに存在しないURL(タイトル=URLのフォールバック表示)
export const Uncached: Story = {
  args: {
    url: "https://example.com/not-cached-url",
  },
};
