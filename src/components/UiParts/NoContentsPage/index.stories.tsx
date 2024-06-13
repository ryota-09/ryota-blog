import type { Meta, StoryObj } from "@storybook/react";
import NoContents from "."

const meta = {
  title: 'UiParts/NoContents',
  component: NoContents,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true
    }
  }
} satisfies Meta<typeof NoContents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {}