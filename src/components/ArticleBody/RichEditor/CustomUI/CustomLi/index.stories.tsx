import type { Meta, StoryObj } from "@storybook/react";

import CustomLi from ".";

const meta = {
  title: 'RichEditor/Li',
  component: CustomLi,
  tags: ['autodocs'],
  decorators: [(Story) => <ul className="m-8"><Story /></ul>],
} satisfies Meta<typeof CustomLi>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "リストテキスト",
  },
}
