import type { Meta, StoryObj } from "@storybook/react";

import CustomBlockquote from ".";

const meta = {
  title: 'RichEditor/Blockquote',
  component: CustomBlockquote,
  tags: ['autodocs'],
  decorators: [(Story) => <div className="m-8"><Story /></div>],
} satisfies Meta<typeof CustomBlockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "引用テキスト引用テキスト引用テキスト",
  },
}

export const WithLink: Story = {
  args: {
    children: (
      <>
        引用テキスト引用テキスト引用テキスト
        <p>
          <a href="https://example.com/hogehogehoge">https://example.com/hogehogehoge</a>
        </p>
      </>
    ),
  },
}
