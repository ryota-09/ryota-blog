import type { Meta, StoryObj } from "@storybook/react";
import parser from "html-react-parser";

import CustomCode from ".";
import { customReplaceOptions } from "@/components/ArticleBody/RichEditor/ReplaceUiParts.lib";

const meta = {
  title: 'RichEditor/Code',
  component: CustomCode,
  tags: ['autodocs']
} satisfies Meta<typeof CustomCode>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: { html: string }) => <div className="m-8" >{parser(args.html, customReplaceOptions)}</div>

export const Default: Story = {
  render: () => {
    const testHTML = "<code>CodeText</code>"
    return <Template html={testHTML} />
  }
}