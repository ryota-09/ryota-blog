import { pickLocalized } from "@/lib/i18n-utils";
import { NOW } from "@/static/about";
import SectionHeading from "../SectionHeading";

type NowSectionProps = {
  locale: string;
};

// /now ページ規範のセクション
const NowSection = ({ locale }: NowSectionProps) => {
  const title = locale === "en" ? "What I'm focused on now" : "いま取り組んでいること";
  const lastUpdatedLabel = locale === "en" ? "Last updated" : "最終更新";

  return (
    <section
      aria-labelledby="now-heading"
      className="rounded-lg border border-base-color/30 dark:border-primary/30 bg-light/20 dark:bg-primary/10 p-6 md:p-10"
    >
      <SectionHeading id="now-heading" eyebrow="// /now" title={title} />
      <p className="mt-8 max-w-prose text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {pickLocalized(NOW.intro, locale)}
      </p>
      <dl className="mt-6 grid gap-5 sm:grid-cols-2">
        {NOW.items.map((item) => (
          <div key={pickLocalized(item.category, locale)} className="flex flex-col gap-1.5">
            <dt className="font-mono text-sm font-semibold text-primary dark:text-base-color">
              {pickLocalized(item.category, locale)}
            </dt>
            <dd className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {pickLocalized(item.body, locale)}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 font-mono text-xs text-gray-500">
        {lastUpdatedLabel}: <time dateTime={NOW.lastUpdated}>{NOW.lastUpdated}</time>
      </p>
    </section>
  );
};

export default NowSection;
