import type { Meta, StoryObj } from "@storybook/react";
import parser from "html-react-parser";

import CustomIframe from ".";
import { customReplaceOptions } from "@/components/ArticleBody/RichEditor/ReplaceUiParts.lib";
import { useEffect } from "react";

const meta = {
  title: 'RichEditor/Iframe',
  component: CustomIframe,
  tags: ['autodocs'],
  args: {
    href: "https://hogehoge"
  }
} satisfies Meta<typeof CustomIframe>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: { html: string }) => {

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "//cdn.iframe.ly/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="m-8" >{parser(args.html, customReplaceOptions)}</div>
  )
}

export const Default: Story = {
  render: () => {
    const testHTML = ``
    return <Template html={testHTML} />
  }
}