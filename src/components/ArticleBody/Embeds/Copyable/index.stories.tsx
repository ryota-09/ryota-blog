import type { Meta, StoryObj } from "@storybook/react";
import Copyable from ".";

const meta = {
  title: "ArticleBody/Embeds/Copyable",
  component: Copyable,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Copyable>;

export default meta;
type Story = StoryObj<typeof meta>;

// MDXの<Copyable>A2R7FE3K</Copyable>(紹介コード)の実例を再現
export const Default: Story = {
  args: {
    children: "A2R7FE3K",
  },
};
