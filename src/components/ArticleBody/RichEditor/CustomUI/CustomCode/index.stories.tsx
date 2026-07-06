import type { Meta, StoryObj } from "@storybook/react";

import CustomCode from ".";

const meta = {
  title: 'RichEditor/Code',
  component: CustomCode,
  tags: ['autodocs'],
  decorators: [(Story) => <div className="m-8"><Story /></div>],
} satisfies Meta<typeof CustomCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "CodeText",
  },
}
