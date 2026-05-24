import type { Meta, StoryObj } from "@storybook/react";
import SectionHeading from ".";

const meta = {
  title: "About/SectionHeading",
  component: SectionHeading,
  tags: ["autodocs"],
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "story-heading",
    eyebrow: "// Career",
    title: "これまでの歩み",
  },
};

export const WithDescription: Story = {
  args: {
    id: "story-heading-desc",
    eyebrow: "// Mission",
    title: "このブログを書く理由",
    description:
      "同じ場所で詰まった人の時間を、5分でも短くする。を合言葉に書いています。",
  },
};

export const NoEyebrow: Story = {
  args: {
    id: "story-heading-no-eyebrow",
    title: "自己紹介",
  },
};
