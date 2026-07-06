import type { Meta, StoryObj } from "@storybook/react";
import AmazonLink from ".";

const meta = {
  title: "ArticleBody/Embeds/AmazonLink",
  component: AmazonLink,
  tags: ["autodocs"],
} satisfies Meta<typeof AmazonLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "//af.moshimo.com/af/c/click?a_id=2351007&p_id=170&pc_id=185&pl_id=4062&url=https%3A%2F%2Fwww.amazon.co.jp%2Fdp%2F4873115655",
    image: "https://images-fe.ssl-images-amazon.com/images/I/51xHT9ZnmNL._SL160_.jpg",
    title: "リーダブルコード ―より良いコードを書くためのシンプルで実践的なテクニック (Theory in practice)",
    trackingImage: "//i.moshimo.com/af/i/impression?a_id=2351007&p_id=170&pc_id=185&pl_id=4062",
  },
};
