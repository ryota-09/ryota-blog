import Script from "next/script";
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

  return (
    <Script
      id="about-person-json-ld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default PersonJsonLd;
