import type { Meta, StoryObj } from "@storybook/react";
import parser from "html-react-parser";

import CustomTable from "./CustomTable";
import { customReplaceOptions } from "@/components/ArticleBody/RichEditor/ReplaceUiParts.lib";

const meta = {
  title: 'RichEditor/Table',
  component: CustomTable,
  tags: ['autodocs']
} satisfies Meta<typeof CustomTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: { html: string }) => <div className="m-8" >{parser(args.html, customReplaceOptions)}</div>

export const Default: Story = {
  render: () => {
    const testHTML = `
      <table><tbody><tr><th colspan=\"1\" rowspan=\"1\"><p></p></th><th colspan=\"1\" rowspan=\"1\"><p>1回目</p></th><th colspan=\"1\" rowspan=\"1\"><p>2回目</p></th><th colspan=\"1\" rowspan=\"1\"><p>3回目</p></th></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>1</p></td><td colspan=\"1\" rowspan=\"1\"><p>47%\t</p></td><td colspan=\"1\" rowspan=\"1\"><p>73%</p></td><td colspan=\"1\" rowspan=\"1\"><p></p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>2</p></td><td colspan=\"1\" rowspan=\"1\"><p>36%</p></td><td colspan=\"1\" rowspan=\"1\"><p>56%</p></td><td colspan=\"1\" rowspan=\"1\"><p>80%</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>3</p></td><td colspan=\"1\" rowspan=\"1\"><p>44%</p></td><td colspan=\"1\" rowspan=\"1\"><p>73%</p></td><td colspan=\"1\" rowspan=\"1\"><p>81%</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>4</p></td><td colspan=\"1\" rowspan=\"1\"><p>44%</p></td><td colspan=\"1\" rowspan=\"1\"><p>61%\t</p></td><td colspan=\"1\" rowspan=\"1\"><p>78%</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>5</p></td><td colspan=\"1\" rowspan=\"1\"><p>43%</p></td><td colspan=\"1\" rowspan=\"1\"><p>69%</p></td><td colspan=\"1\" rowspan=\"1\"><p></p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>6</p></td><td colspan=\"1\" rowspan=\"1\"><p>43%</p></td><td colspan=\"1\" rowspan=\"1\"><p>73%</p></td><td colspan=\"1\" rowspan=\"1\"><p></p></td></tr></tbody></table>
    `
    return <Template html={testHTML} />
  }
}