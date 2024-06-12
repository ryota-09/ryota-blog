import type { Meta, StoryObj } from "@storybook/react";
import Tooltip from "."

const meta = {
  title: 'UiParts/Tooltip',
  component: Tooltip,
  tags: ['autodocs']
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'テストラベル',
    className: 'absolute -top-2 rounded p-1 text-white text-xs bg-gray-600 before:border-t-gray-600',
    children: <div className="m-8">テストテスト</div>,
  }
}