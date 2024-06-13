import type { Meta, StoryObj } from "@storybook/react";
import parser from "html-react-parser";

import CustomH2 from ".";
import { customReplaceOptions } from "@/components/ArticleBody/RichEditor/ReplaceUiParts.lib";

const meta = {
  title: 'RichEditor/H2',
  component: CustomH2,
  tags: ['autodocs']
} satisfies Meta<typeof CustomH2>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: { html: string }) => <div className="m-8" >{parser(args.html, customReplaceOptions)}</div>

export const Default: Story = {
  parameters: {
    // NOTE: usePathnameが機能できるように設定
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/blogs"
      }
    }
  },
  render: () => {
    const testHTML = "<h2 id='test_id'>H2テキストH2テキストH2テキスト</h2>"
    return <Template html={testHTML} />
  }
}