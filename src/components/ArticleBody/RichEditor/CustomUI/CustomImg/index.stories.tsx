import type { Meta, StoryObj } from "@storybook/react";
import parser from "html-react-parser";

import CustomImg from ".";
import { customReplaceOptions } from "@/components/ArticleBody/RichEditor/ReplaceUiParts.lib";

const meta = {
  title: 'RichEditor/Img',
  component: CustomImg,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    src: "",
    alt: "",
    height: "",
    width: "",
  },
} satisfies Meta<typeof CustomImg>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: { html: string }) => <div className="m-8 max-w-[365px]" >{parser(args.html, customReplaceOptions)}</div>

export const Default: Story = {
  render: () => {
    const testHTML = "<img src='/author.jpg' alt='ダミー画像' height='200' width='200' />"
    return <Template html={testHTML} />
  }
}

export const PlaneImg: Story = {
  render: () => {
    const testHTML = "<img src='/author.jpg' alt='ダミー画像' />"
    return <Template html={testHTML} />
  }
}