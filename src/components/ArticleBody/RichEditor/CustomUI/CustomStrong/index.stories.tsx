import type { Meta, StoryObj } from "@storybook/react";
import parser from "html-react-parser";

import CustomStrong from ".";
import { customReplaceOptions } from "@/components/ArticleBody/RichEditor/ReplaceUiParts.lib";

const meta = {
  title: 'RichEditor/Strong',
  component: CustomStrong,
  tags: ['autodocs']
} satisfies Meta<typeof CustomStrong>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: { html: string }) => <div className="m-8" >{parser(args.html, customReplaceOptions)}</div>

export const Default: Story = {
  render: () => {
    const testHTML = "<p>テキストテキスト<strong>強調テキスト</strong>テキストテキスト</p>"
    return <Template html={testHTML} />
  }
}