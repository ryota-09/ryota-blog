import type { Meta, StoryObj } from "@storybook/react";
import ThumbnailCard from ".";

const meta = {
  title: 'Components/ThumbnailCard',
  component: ThumbnailCard,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true
    }
  }
} satisfies Meta<typeof ThumbnailCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'タイトルテキストタイトルテキストタイトルテキストタイトルテキストタイトルテキスト'
  }
};