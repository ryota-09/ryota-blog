import type { Meta, StoryObj } from "@storybook/react";

import CustomParagraph from ".";

const meta = {
  title: 'RichEditor/Paragraph',
  component: CustomParagraph,
  tags: ['autodocs'],
  decorators: [(Story) => <div className="m-8"><Story /></div>],
} satisfies Meta<typeof CustomParagraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "テストテキスト",
  },
}
