import type { Meta, StoryObj } from "@storybook/react";

import CustomUl from ".";
import CustomLi from "@/components/ArticleBody/RichEditor/CustomUI/CustomLi";

const meta = {
  title: 'RichEditor/Ul',
  component: CustomUl,
  tags: ['autodocs'],
  decorators: [(Story) => <div className="m-8"><Story /></div>],
} satisfies Meta<typeof CustomUl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <CustomLi>リストテキスト</CustomLi>
        <CustomLi>リストテキスト</CustomLi>
        <CustomLi>リストテキスト</CustomLi>
      </>
    ),
  },
}
