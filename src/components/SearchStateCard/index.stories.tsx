import type { Meta, StoryObj } from "@storybook/react";
import SearchStateCard from ".";

const meta = {
  title: 'Components/SearchStateCard',
  component: SearchStateCard,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true
    }
  },
  decorators: [
    (Story) => (
      <div className="m-8">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof SearchStateCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const KeyWord: Story = {
  args: {
    keyword: "キーワード"
  }
};

export const Category: Story = {
  args: {
    category: "TypeScript"
  }
};

export const Both: Story = {
  args: {
    keyword: "テストキーワード",
    category: "Next.js"
  }
};