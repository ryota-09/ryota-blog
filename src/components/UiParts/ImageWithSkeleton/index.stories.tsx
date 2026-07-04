import type { Meta, StoryObj } from "@storybook/react";
import ImageWithSkeleton from ".";

const meta = {
  title: "UiParts/ImageWithSkeleton",
  component: ImageWithSkeleton,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof ImageWithSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// NOTE: Storybook上では実際の読み込み完了イベントが即時発火するため、
// スケルトンが一瞬で消える見た目になる（本番の低速回線下での見え方を確認する場合はブラウザのネットワークスロットリングを併用すること）
//
// NOTE: wrapperClassName を指定しない使い方（ArticleCard/ArticleBody等と同じ）を示すため、
// 呼び出し側が position: relative なコンテナを用意する契約を decorator で再現している。
// これが無いとスケルトンの absolute inset-0 が画像サイズを超えて広がってしまう。
export const Default: Story = {
  args: {
    src: "/author.png",
    alt: "サンプル画像",
    width: 200,
    height: 200,
  },
  decorators: [
    (Story) => (
      <div className="relative inline-block h-[200px] w-[200px]">
        <Story />
      </div>
    ),
  ],
};

export const WithWrapper: Story = {
  args: {
    src: "/author.png",
    alt: "サンプル画像（固定幅のアバター想定）",
    width: 96,
    height: 96,
    className: "aspect-square w-20 rounded-full object-cover shadow-md",
    wrapperClassName: "shrink-0",
  },
  decorators: [
    (Story) => (
      <div className="flex w-64 items-center gap-4 border border-dashed border-gray-300 p-4">
        <Story />
        <p>横に並ぶテキスト（アバターが縮まないことを確認）</p>
      </div>
    ),
  ],
};
