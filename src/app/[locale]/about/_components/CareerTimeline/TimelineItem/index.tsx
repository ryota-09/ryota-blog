import Chip from "@/components/UiParts/Chip";
import { formatPeriod, pickLocalized } from "@/lib/i18n-utils";
import type { TimelineEntry } from "@/types/about";

type TimelineItemProps = {
  entry: TimelineEntry;
  locale: string;
};

// キャリアタイムラインの1エントリ
const TimelineItem = ({ entry, locale }: TimelineItemProps) => {
  const role = pickLocalized(entry.role, locale);
  const org = pickLocalized(entry.org, locale);
  const summary = pickLocalized(entry.summary, locale);

  return (
    <li className="relative pl-6">
      {/* タイムラインの丸ドット。罫線と分離させるため白/黒のリングを付ける */}
      <span
        aria-hidden
        className="absolute -left-[7px] top-2 h-3 w-3 rounded-full bg-base-color ring-4 ring-white dark:bg-primary dark:ring-black"
      />
      <p className="font-mono text-sm text-gray-500 dark:text-gray-400">{formatPeriod(entry.period, locale)}</p>
      <h3 className="mt-1 text-lg font-semibold leading-snug">
        {role}
        <span className="block text-sm font-normal text-gray-500 dark:text-gray-400 sm:ml-2 sm:inline">
          @ {org}
        </span>
      </h3>
      <ul className="mt-3 space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
        {summary.map((s) => (
          <li key={s} className="flex gap-2">
            <span aria-hidden className="shrink-0 text-gray-400">
              —
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {entry.domains.map((d) => (
          <Chip
            key={d}
            label={d}
            noTruncate
            classes="bg-light/40 dark:bg-primary/20 text-txt-base dark:text-gray-100 px-2 py-0.5 text-[11px] font-mono min-w-0"
          />
        ))}
      </div>
    </li>
  );
};

export default TimelineItem;
