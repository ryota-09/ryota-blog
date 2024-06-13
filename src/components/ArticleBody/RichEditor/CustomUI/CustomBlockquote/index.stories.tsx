import type { Meta, StoryObj } from "@storybook/react";
import parser from "html-react-parser";

import CustomBlockquote from ".";
import { customReplaceOptions } from "@/components/ArticleBody/RichEditor/ReplaceUiParts.lib";

const meta = {
  title: 'RichEditor/Blockquote',
  component: CustomBlockquote,
  tags: ['autodocs']
} satisfies Meta<typeof CustomBlockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: { html: string }) => <div className="m-8" >{parser(args.html, customReplaceOptions)}</div>

export const Default: Story = {
  render: () => {
    const testHTML = "<blockquote>引用テキスト引用テキスト引用テキスト</blockquote>"
    return <Template html={testHTML} />
  }
}

export const WithLink: Story = {
  render: () => {
    const testHTML = "<blockquote>引用テキスト引用テキスト引用テキスト<p><a href='https://example.com/hogehogehoge'>https://example.com/hogehogehoge</a></p></blockquote>"
    return <Template html={testHTML} />
  }
}