import type { Meta, StoryObj } from "@storybook/react";
import Chip from "."

const meta = {
  title: 'UiParts/Chip',
  component: Chip,
  tags: ['autodocs']
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'テスト',
    classes: 'bg-secondary text-white w-12',
  }
}