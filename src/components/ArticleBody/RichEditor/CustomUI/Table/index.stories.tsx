import type { Meta, StoryObj } from "@storybook/react";

import CustomTable from "./CustomTable";
import CustomTbody from "./CustomTbody";
import CustomTr from "./CustomTr";
import CustomTh from "./CustomTh";
import CustomTd from "./CustomTd";

const meta = {
  title: 'RichEditor/Table',
  component: CustomTable,
  tags: ['autodocs'],
  decorators: [(Story) => <div className="m-8"><Story /></div>],
} satisfies Meta<typeof CustomTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// NOTE: 元データはmicroCMSリッチエディタが出力していたテーブルHTML(旧ReplaceUiParts経由の描画テスト)を
// CustomTbody/CustomTr/CustomTh/CustomTdの直接組み立てに置き換えたもの。見た目・構造は同一。
export const Default: Story = {
  args: {
    children: (
      <CustomTbody>
        <CustomTr>
          <CustomTh />
          <CustomTh>1回目</CustomTh>
          <CustomTh>2回目</CustomTh>
          <CustomTh>3回目</CustomTh>
        </CustomTr>
        <CustomTr>
          <CustomTd>1</CustomTd>
          <CustomTd>47%</CustomTd>
          <CustomTd>73%</CustomTd>
          <CustomTd></CustomTd>
        </CustomTr>
        <CustomTr>
          <CustomTd>2</CustomTd>
          <CustomTd>36%</CustomTd>
          <CustomTd>56%</CustomTd>
          <CustomTd>80%</CustomTd>
        </CustomTr>
        <CustomTr>
          <CustomTd>3</CustomTd>
          <CustomTd>44%</CustomTd>
          <CustomTd>73%</CustomTd>
          <CustomTd>81%</CustomTd>
        </CustomTr>
        <CustomTr>
          <CustomTd>4</CustomTd>
          <CustomTd>44%</CustomTd>
          <CustomTd>61%</CustomTd>
          <CustomTd>78%</CustomTd>
        </CustomTr>
        <CustomTr>
          <CustomTd>5</CustomTd>
          <CustomTd>43%</CustomTd>
          <CustomTd>69%</CustomTd>
          <CustomTd></CustomTd>
        </CustomTr>
        <CustomTr>
          <CustomTd>6</CustomTd>
          <CustomTd>43%</CustomTd>
          <CustomTd>73%</CustomTd>
          <CustomTd></CustomTd>
        </CustomTr>
      </CustomTbody>
    ),
  },
}
