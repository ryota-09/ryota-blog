import type { Meta, StoryObj } from "@storybook/react";

import CustomStrong from ".";

const meta = {
  title: 'RichEditor/Strong',
  component: CustomStrong,
  tags: ['autodocs'],
  decorators: [(Story) => <p className="m-8">テキストテキスト<Story />テキストテキスト</p>],
} satisfies Meta<typeof CustomStrong>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "強調テキスト",
  },
}
