import type { Meta, StoryObj } from "@storybook/react";

import XShareButton from ".";

const meta = {
  title: 'UiParts/XShareButton',
  component: XShareButton,
  tags: ['autodocs']
} satisfies Meta<typeof XShareButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Xにシェアする(テスト用)",
    classes: "fixed bottom-4 bottom-4 left-4 bg-gray-400 dark:bg-gray-600 text-white text-sm w-auto h-10 px-2 flex items-center justify-center rounded-lg shadow-lg transition-opacity duration-300 hover:bg-opacity-70 active:bg-gray-500",
    url: "https://hogehoge"
  },
  decorators: [
    (Story) => {
      return (
        <div className=" h-[1000px]">
          <p>400px程度スクロールしてボタンを表示する ↓↓↓</p>
          <Story />
        </div>
      )
    }
  ]
}