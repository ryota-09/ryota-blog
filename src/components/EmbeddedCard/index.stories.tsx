import type { Meta, StoryObj } from "@storybook/react";
import EmbeddedCard from ".";

const meta = {
  title: 'Components/EmbeddedCard',
  component: EmbeddedCard,
  tags: ['autodocs']
} satisfies Meta<typeof EmbeddedCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const data = {
  title: 'タイトルタイトルタイトルタイトルタイトルタイトル',
  description: 'description、description、description、description、description、',
  url: 'https://ryotablog.jp/blogs',
  website: 'https://ryotablog.jp',
  banner: './500.png',
}

export const Default: Story = {
  args: {
    ...data
  }
};