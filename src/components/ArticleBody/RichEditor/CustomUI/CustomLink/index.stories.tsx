import type { Meta, StoryObj } from "@storybook/react";
import parser from "html-react-parser";

import CustomLink from ".";
import { customReplaceOptions } from "@/components/ArticleBody/RichEditor/ReplaceUiParts.lib";

const meta = {
  title: 'RichEditor/Link',
  component: CustomLink,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true, 
    },
  },
} satisfies Meta<typeof CustomLink>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: { html: string }) => <div className="m-8" >{parser(args.html, customReplaceOptions)}</div>

export const Default: Story = {
  render: () => {
    const testHTML = "<a href='#'>Anchorテキスト</a>"
    return <Template html={testHTML} />
  }
}

export const Internal: Story = {
  render: () => {
    const testHTML = "<a href='/blogs'>内部リンクテキスト</a>"
    return <Template html={testHTML} />
  }
}

export const External: Story = {
  render: () => {
    const testHTML = "<a href='https://hogehoge' target=\"_blank\" rel=\"noopener noreferrer nofollow\">外部リンクテキスト(別タブ)</a>"
    return <Template html={testHTML} />
  }
}