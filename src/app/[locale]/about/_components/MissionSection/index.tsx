import { pickLocalized } from "@/lib/i18n-utils";
import { MISSION } from "@/static/about";
import SectionHeading from "../SectionHeading";

type MissionSectionProps = {
  locale: string;
};

// ミッションセクション。価値観を明示するブランドの軸
const MissionSection = ({ locale }: MissionSectionProps) => {
  const headline = pickLocalized(MISSION.headline, locale);
  const body = pickLocalized(MISSION.body, locale);
  const principles = pickLocalized(MISSION.principles, locale);
  const title = locale === "en" ? "Why I write" : "このブログを書く理由";

  return (
    <section
      aria-labelledby="mission-heading"
      className="rounded-lg border border-base-color/30 dark:border-primary/30 bg-light/20 dark:bg-primary/10 p-6 md:p-10"
    >
      <SectionHeading id="mission-heading" eyebrow="// Mission" title={title} />
      <p className="mt-8 text-xl md:text-2xl font-bold text-primary dark:text-base-color leading-snug text-balance">
        {headline}
      </p>
      <div className="mt-6 space-y-4 max-w-prose text-gray-700 dark:text-gray-200 leading-relaxed">
        {body.map((p, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
      </div>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {principles.map((p) => (
          <li key={p} className="flex gap-2 text-sm leading-relaxed">
            <span aria-hidden className="shrink-0 font-mono text-primary dark:text-base-color">
              ›
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MissionSection;
