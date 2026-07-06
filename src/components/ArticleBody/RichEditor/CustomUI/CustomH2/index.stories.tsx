import type { Meta, StoryObj } from "@storybook/react";

import CustomH2 from ".";

const meta = {
  title: 'RichEditor/H2',
  component: CustomH2,
  tags: ['autodocs'],
  parameters: {
    // NOTE: usePathnameが機能できるように設定
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/blogs"
      }
    }
  },
  decorators: [(Story) => <div className="m-8"><Story /></div>],
} satisfies Meta<typeof CustomH2>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "test_id",
    children: "H2テキストH2テキストH2テキスト",
  },
}
