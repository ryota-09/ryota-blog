import type { Meta, StoryObj } from "@storybook/react";
import parser from "html-react-parser";

import CustomLi from ".";
import { customReplaceOptions } from "@/components/ArticleBody/RichEditor/ReplaceUiParts.lib";

const meta = {
  title: 'RichEditor/Li',
  component: CustomLi,
  tags: ['autodocs']
} satisfies Meta<typeof CustomLi>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: { html: string }) => <div className="m-8" >{parser(args.html, customReplaceOptions)}</div>

export const Default: Story = {
  render: () => {
    const testHTML = "<ul><li>リストテキスト</li><li>リストテキスト</li><li>リストテキスト</li></ul>"
    return <Template html={testHTML} />
  }
}