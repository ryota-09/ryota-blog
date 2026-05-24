import { pickLocalized } from "@/lib/i18n-utils";
import { ABOUT_ME } from "@/static/about";
import SectionHeading from "../SectionHeading";

type AboutMeSectionProps = {
  locale: string;
};

// 自己紹介セクション。3段落の本文 + 趣味の1行
const AboutMeSection = ({ locale }: AboutMeSectionProps) => {
  const paragraphs = pickLocalized(ABOUT_ME.paragraphs, locale);
  const hobbies = pickLocalized(ABOUT_ME.hobbies, locale);
  const eyebrow = locale === "en" ? "// About me" : "// About me";
  const title = locale === "en" ? "About me" : "自己紹介";

  return (
    <section aria-labelledby="aboutme-heading" className="max-w-prose">
      <SectionHeading id="aboutme-heading" eyebrow={eyebrow} title={title} />
      <div className="mt-8 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        {paragraphs.map((p, i) => (
          // .highlight クラスを本文の一部に当てるために静的データの HTML を流し込む
          // データソースは静的ファイル限定なので XSS リスクなし
          <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
      </div>
      <p className="mt-6 text-sm text-gray-500">{hobbies}</p>
    </section>
  );
};

export default AboutMeSection;
