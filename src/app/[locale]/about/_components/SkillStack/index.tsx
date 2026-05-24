import { SKILL_GROUPS } from "@/static/about";
import SectionHeading from "../SectionHeading";
import SkillGroup from "./SkillGroup";

type SkillStackProps = {
  locale: string;
};

// スキルスタックセクション
const SkillStack = ({ locale }: SkillStackProps) => {
  const mainGroups = SKILL_GROUPS.filter((g) => g.level === "main");
  const subGroups = SKILL_GROUPS.filter((g) => g.level === "sub");

  const labels = {
    main: locale === "en" ? "Primary in work" : "業務でメイン",
    sub: locale === "en" ? "Secondary" : "業務でサブ",
  };
  const title = locale === "en" ? "Tech stack" : "技術スタック";

  return (
    <section aria-labelledby="skills-heading">
      <SectionHeading id="skills-heading" eyebrow="// Skills" title={title} />

      <div className="mt-8 space-y-8">
        <SkillGroup level="main" groups={mainGroups} label={labels.main} locale={locale} />
        <SkillGroup level="sub" groups={subGroups} label={labels.sub} locale={locale} />
      </div>
    </section>
  );
};

export default SkillStack;
