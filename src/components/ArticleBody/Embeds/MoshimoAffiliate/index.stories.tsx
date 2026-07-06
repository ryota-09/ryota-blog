import type { Meta, StoryObj } from "@storybook/react";
import MoshimoAffiliate from ".";

const meta = {
  title: "ArticleBody/Embeds/MoshimoAffiliate",
  component: MoshimoAffiliate,
  tags: ["autodocs"],
} satisfies Meta<typeof MoshimoAffiliate>;

export default meta;
type Story = StoryObj<typeof meta>;

// content/blogs/best-buy-2026-first-half/index.ja.mdx の実データ(moshimoWidgets[0])を元にした例
export const Default: Story = {
  args: {
    widget: {
      n: "山崎実業 レンジフード調味料ラック プレート ホワイト 3128",
      b: "Yamazaki(山崎実業)",
      t: "3128",
      d: "https://m.media-amazon.com",
      c_p: "/images/I",
      p: ["/31wYkha3ftL._SL500_.jpg"],
      u: {
        u: "https://www.amazon.co.jp/dp/B01CXPT43I",
        t: "amazon",
        r_v: "",
      },
      v: "2.1",
      b_l: [
        {
          id: 1,
          u_tx: "Amazonで見る",
          u_bc: "#f79256",
          u_url: "https://www.amazon.co.jp/dp/B01CXPT43I",
          a_id: 2351007,
          p_id: 170,
          pl_id: 27060,
          pc_id: 185,
          s_n: "amazon",
          u_so: 1,
        },
      ],
      eid: "pjRST",
      s: "s",
    },
  },
};
