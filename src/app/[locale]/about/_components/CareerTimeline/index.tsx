import { TIMELINE } from "@/static/about";
import SectionHeading from "../SectionHeading";
import TimelineItem from "./TimelineItem";

type CareerTimelineProps = {
  locale: string;
};

// キャリアタイムラインのセクション
const CareerTimeline = ({ locale }: CareerTimelineProps) => {
  const title = locale === "en" ? "Career" : "これまでの歩み";

  return (
    <section aria-labelledby="career-heading">
      <SectionHeading id="career-heading" eyebrow="// Career" title={title} />
      <ol className="relative mt-8 ml-2 space-y-10 border-l-2 border-base-color/60 dark:border-primary/60">
        {TIMELINE.map((entry) => (
          <TimelineItem key={entry.id} entry={entry} locale={locale} />
        ))}
      </ol>
    </section>
  );
};

export default CareerTimeline;
