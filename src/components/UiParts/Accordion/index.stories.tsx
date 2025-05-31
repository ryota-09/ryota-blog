import type { Meta, StoryObj } from "@storybook/react";
import Accordion from ".";

const meta = {
  title: 'UiParts/Accordion',
  component: Accordion,
  tags: ['autodocs']
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'アコーディオンタイトル',
    children: (
      <ol className="bg-blue-200">
        <li>アコーディオン内のコンテンツ</li>
        <li>アコーディオン内のコンテンツ</li>
        <li>アコーディオン内のコンテンツ</li>
        <li>アコーディオン内のコンテンツ</li>
      </ol>
    ),
    classes: 'bg-gray-100 p-4 cursor-pointer'
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    )
  ]
};