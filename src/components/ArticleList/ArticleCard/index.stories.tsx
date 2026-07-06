import type { Meta, StoryObj } from "@storybook/react";
import ArticleCard from ".";
import type { BlogPost } from "@/types/content";

const meta = {
  title: 'Components/ArticleCard',
  component: ArticleCard,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true
    }
  }
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const data: BlogPost = {
  "slug": "customdomain-apprunner-with-terraform-route53",
  "locale": "ja",
  "publishedAt": new Date().toISOString(),
  "updatedAt": new Date().toISOString(),
  "title": "タイトルテキストタイトルテキストタイトルテキストタイトルテキストタイトルテキスト",
  "description": "今回は〇〇する方法を紹介していきます！今回は〇〇する方法を紹介していきます！今回は〇〇する方法を紹介していきます！今回は〇〇する方法を紹介していきます！",
  "noIndex": false,
  "isAdvertisement": false,
  "thumbnail": {
    "src": "./no_contents.png",
    "height": 1080,
    "width": 1920,
    "blurDataURL": "",
    "blurWidth": 8,
    "blurHeight": 8
  },
  "categories": ["aws", "terraform"],
  "related": [],
  "headingIds": [],
  "moshimoWidgets": [],
  "body": "",
  "raw": "",
  "toc": [],
  "plainText": "",
}

export const Default: Story = {
  args: {
    data,
    index: 0
  },
  decorators: [
    (Story) => (
      <ul className="grid grid-cols-2 gap-8">
        <Story />
        <Story />
        <Story />
        <Story />
      </ul>
    )
  ]
};