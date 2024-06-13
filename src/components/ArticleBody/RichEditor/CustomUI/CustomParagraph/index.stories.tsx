import type { Meta, StoryObj } from "@storybook/react";
import parser from "html-react-parser";

import CustomParagraph from ".";
import { customReplaceOptions } from "@/components/ArticleBody/RichEditor/ReplaceUiParts.lib";

const meta = {
  title: 'RichEditor/Paragraph',
  component: CustomParagraph,
  tags: ['autodocs']
} satisfies Meta<typeof CustomParagraph>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: { html: string }) => <div className="m-8" >{parser(args.html, customReplaceOptions)}</div>

export const Default: Story = {
  render: () => {
    const testHTML = "<p>テストテキスト</p>"
    return <Template html={testHTML} />
  }
}