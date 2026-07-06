import type { Meta, StoryObj } from "@storybook/react";

import CustomImg from ".";

const meta = {
  title: "RichEditor/Img",
  component: CustomImg,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    src: "",
    alt: "",
    height: "",
    width: "",
  },
  decorators: [(Story) => <div className="m-8 max-w-[365px]"><Story /></div>],
} satisfies Meta<typeof CustomImg>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: "/author.png",
    alt: "ダミー画像",
    height: "200",
    width: "200",
  },
};

export const PlaneImg: Story = {
  args: {
    src: "/author.png",
    alt: "ダミー画像",
    height: "",
    width: "",
  },
};
