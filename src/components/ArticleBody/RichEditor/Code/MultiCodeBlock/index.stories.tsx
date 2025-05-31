import type { Meta, StoryObj } from "@storybook/react";
import parser from "html-react-parser";

import MultiCodeBlock from ".";
import { customReplaceOptions } from "@/components/ArticleBody/RichEditor/ReplaceUiParts.lib";

const meta = {
  title: 'RichEditor/MultiCodeBlock',
  component: MultiCodeBlock,
  tags: ['autodocs'],
  args: {
    children: "",
    filename: null,
  }
} satisfies Meta<typeof MultiCodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: { html: string }) => <div className="m-8" >{parser(args.html, customReplaceOptions)}</div>

export const Default: Story = {
  render: () => {
    const testHTML = "<pre><code class=\"language-typescript\">toPropValue(&quot;margin&quot;, { base: 1, sm: 2 }, theme)\n//出力\nmargin: 8px;\n@media screen and (min-width: 1280px) {margin: 64px;}</code></pre>"
    return <Template html={testHTML} />
  }
}