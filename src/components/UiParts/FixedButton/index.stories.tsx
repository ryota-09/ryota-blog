import type { Meta, StoryObj } from "@storybook/react";

import FixedButton from ".";

const meta = {
  title: 'UiParts/FixedButton',
  component: FixedButton,
  tags: ['autodocs']
} satisfies Meta<typeof FixedButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
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