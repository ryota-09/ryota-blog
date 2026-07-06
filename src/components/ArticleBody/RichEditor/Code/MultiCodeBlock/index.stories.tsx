import type { Meta, StoryObj } from "@storybook/react";

import MultiCodeBlock from ".";

const meta = {
  title: 'RichEditor/MultiCodeBlock',
  component: MultiCodeBlock,
  tags: ['autodocs'],
  args: {
    children: "",
    filename: null,
  },
  decorators: [(Story) => <div className="m-8"><Story /></div>],
} satisfies Meta<typeof MultiCodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lang: "typescript",
    filename: null,
    children: "toPropValue(\"margin\", { base: 1, sm: 2 }, theme)\n//出力\nmargin: 8px;\n@media screen and (min-width: 1280px) {margin: 64px;}",
  },
}