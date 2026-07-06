import type { Meta, StoryObj } from "@storybook/react";
import RelatedContentList from ".";

const meta = {
  title: 'Components/RelatedContentList',
  component: RelatedContentList,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true
    }
  },
} satisfies Meta<typeof RelatedContentList>;

export default meta;
type Story = StoryObj<typeof meta>;

const data = {
  slug: "customdomain-apprunner-with-terraform-route53",
  updatedAt: "2024-06-15T04:26:30.883Z",
  publishedAt: new Date().toISOString(),
  title: "タイトルテキストタイトルテキストタイトルテキストタイトルテキストタイトルテキスト",
  categories: ["aws", "terraform", "next_js"],
}

export const Default: Story = {
  args: {
    data: [data, data, data]
  }
};