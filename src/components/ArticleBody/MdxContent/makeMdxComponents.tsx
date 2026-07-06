import type { ComponentProps } from "react";

import CustomH2 from "@/components/ArticleBody/RichEditor/CustomUI/CustomH2";
import CustomH3 from "@/components/ArticleBody/RichEditor/CustomUI/CustomH3";
import CustomParagraph from "@/components/ArticleBody/RichEditor/CustomUI/CustomParagraph";
import CustomStrong from "@/components/ArticleBody/RichEditor/CustomUI/CustomStrong";
import CustomU from "@/components/ArticleBody/RichEditor/CustomUI/CustomU";
import CustomUl from "@/components/ArticleBody/RichEditor/CustomUI/CustomUl";
import CustomLi from "@/components/ArticleBody/RichEditor/CustomUI/CustomLi";
import CustomCode from "@/components/ArticleBody/RichEditor/CustomUI/CustomCode";
import CustomTable from "@/components/ArticleBody/RichEditor/CustomUI/Table/CustomTable";
import CustomTbody from "@/components/ArticleBody/RichEditor/CustomUI/Table/CustomTbody";
import CustomTr from "@/components/ArticleBody/RichEditor/CustomUI/Table/CustomTr";
import CustomTh from "@/components/ArticleBody/RichEditor/CustomUI/Table/CustomTh";
import CustomTd from "@/components/ArticleBody/RichEditor/CustomUI/Table/CustomTd";

import Tweet from "@/components/ArticleBody/Embeds/Tweet";
import LinkCard from "@/components/ArticleBody/Embeds/LinkCard";
import AmazonLink from "@/components/ArticleBody/Embeds/AmazonLink";
import MoshimoAffiliate from "@/components/ArticleBody/Embeds/MoshimoAffiliate";
import Copyable from "@/components/ArticleBody/Embeds/Copyable";

import type { BlogPost } from "@/types/content";

import MdxBlockquote from "./MdxBlockquote";
import MdxLink from "./MdxLink";
import MdxImg from "./MdxImg";
import MdxPre from "./MdxPre";

// MoshimoAffiliateのidから対応するウィジェットを解決するために、MDXコンポーネントマップは
// 記事(blog)ごとにファクトリで生成する必要がある(MoshimoAffiliateはprops.idしか受け取らないため、
// blog.moshimoWidgets配列をここで束縛して解決する)。
export const makeMdxComponents = (blog: Pick<BlogPost, "moshimoWidgets">) => {
  return {
    // 見出し: h2/h3のみ現行の特別扱いを踏襲する(h4以下は素のタグ。現行も特別扱いなし)
    h2: CustomH2,
    h3: CustomH3,
    p: CustomParagraph,
    strong: CustomStrong,
    u: CustomU,
    ul: CustomUl,
    li: CustomLi,
    // ol: 現行も特別扱いなし(素のol)。ulとの対比で見た目がずれないよう最低限のインデントは付与する
    ol: (props: ComponentProps<"ol">) => <ol {...props} className="px-8 my-4 list-decimal" />,
    blockquote: MdxBlockquote,
    a: MdxLink,
    img: MdxImg,
    pre: MdxPre,
    code: (props: ComponentProps<"code">) => (
      <CustomCode
        {...props}
        className="bg-gray-200 dark:bg-gray-400 font-mono text-sm dark:text-gray-700 px-1 py-0.5 rounded"
      />
    ),
    table: CustomTable,
    // theadに対応するCustom実装は現行に存在しないため素のtheadを使う(GFMテーブルがthead/thを生成するため必要)
    thead: (props: ComponentProps<"thead">) => <thead {...props} />,
    tbody: CustomTbody,
    tr: CustomTr,
    th: CustomTh,
    td: CustomTd,
    br: (props: ComponentProps<"br">) => <br {...props} />,
    // 埋め込みコンポーネント
    Tweet,
    LinkCard,
    AmazonLink,
    MoshimoAffiliate: ({ id }: { id: string }) => {
      const widget = blog.moshimoWidgets[Number(id)];
      if (!widget) return null;
      return <MoshimoAffiliate widget={widget} />;
    },
    Copyable,
  };
};

export type MdxComponents = ReturnType<typeof makeMdxComponents>;
