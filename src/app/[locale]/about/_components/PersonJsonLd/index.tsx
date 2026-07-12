import type { Person, WithContext } from "schema-dts";
import { baseURL } from "@/config";
import { AUTHOR_E_MAIL } from "@/static/blogs";

type PersonJsonLdProps = {
  locale: string;
};

// about ページ用の Person schema を <script type="application/ld+json"> で出力
const PersonJsonLd = ({ locale }: PersonJsonLdProps) => {
  const data: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "りょた",
    alternateName: ["Ryota"],
    url: `${baseURL}/${locale}/about`,
    image: `${baseURL}/author.png`,
    jobTitle: "Software Engineer",
    email: `mailto:${AUTHOR_E_MAIL}`,
    sameAs: [
      "https://x.com/Ryo54388667",
      "https://zenn.dev/ryota_09",
      "https://github.com/ryota-09",
    ],
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "AWS",
      "Terraform",
      "Hono",
      "Prisma",
    ],
  };

  // NOTE: 記事詳細のJsonLDと同方針。クローラーが確実に読めるよう初期HTMLに直接埋め込む
  // （next/scriptのafterInteractiveだとJS実行後注入になり、非JS実行クローラーが読めない）
  // asyncは必須。next 16.2.10 + React 19系ではasync無しだとSSR出力から消えることを
  // 実測確認済み(詳細は src/components/Head/JsonLD/index.tsx のNOTE参照)
  return (
    <script
      async
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default PersonJsonLd;
