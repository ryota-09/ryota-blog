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

export const WithLongLabel: Story = {
  args: {
    label: 'これは長いラベルのテストケースです',
    classes: 'bg-secondary text-white px-3',
  }
}

export const NoTruncate: Story = {
  args: {
    label: 'GitHub Actions / Terraform / Playwright',
    classes: 'bg-base-color text-white px-3',
    noTruncate: true,
  }
}