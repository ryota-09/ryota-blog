import type { Meta, StoryObj } from "@storybook/react";
import NewLabel from "."

const meta = {
  title: 'UiParts/NewLabel',
  component: NewLabel,
  tags: ['autodocs']
} satisfies Meta<typeof NewLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {}