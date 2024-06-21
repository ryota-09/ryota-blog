import type { Meta, StoryObj } from "@storybook/react";
import ArticleCard from ".";
import type { BlogsContentType } from "@/types/microcms";

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

const data: BlogsContentType = {
  "id": "customdomain-apprunner-with-terraform-route53",
  "createdAt": "2024-06-14T05:36:56.274Z",
  "updatedAt": "2024-06-15T04:26:30.883Z",
  "publishedAt": new Date().toString(),
  "revisedAt": "2024-06-15T04:26:30.883Z",
  "title": "タイトルテキストタイトルテキストタイトルテキストタイトルテキストタイトルテキスト",
  "body": [
    {
      "fieldId": "richEditor",
      "richEditor": ""
    }
  ],
  "description": "今回は〇〇する方法を紹介していきます！今回は〇〇する方法を紹介していきます！今回は〇〇する方法を紹介していきます！今回は〇〇する方法を紹介していきます！",
  "noIndex": false,
  "isAdvertisement": false,
  "thumbnail": {
    "url": "./no_contents.png",
    "height": 1080,
    "width": 1920
  },
  "category": [
    {
      "id": "aws",
      "createdAt": "2024-05-25T05:31:41.218Z",
      "updatedAt": "2024-05-25T07:13:41.932Z",
      "publishedAt": "2024-05-25T05:31:41.218Z",
      "revisedAt": "2024-05-25T05:31:41.218Z",
      "name": "AWS"
    },
    {
      "id": "terraform",
      "createdAt": "2024-06-14T05:40:43.012Z",
      "updatedAt": "2024-06-14T06:08:40.759Z",
      "publishedAt": "2024-06-14T05:40:43.012Z",
      "revisedAt": "2024-06-14T05:40:43.012Z",
      "name": "Terraform"
    }
  ],
  "relatedContent": []
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