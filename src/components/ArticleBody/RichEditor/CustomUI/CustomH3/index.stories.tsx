import type { Meta, StoryObj } from "@storybook/react";

import CustomH3 from ".";

const meta = {
  title: 'RichEditor/H3',
  component: CustomH3,
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
} satisfies Meta<typeof CustomH3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "test_id",
    children: "H3テキストH3テキスト",
  },
}
