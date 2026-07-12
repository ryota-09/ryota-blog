import Chip from "@/components/UiParts/Chip";
import { outputKindLabel, pickLocalized } from "@/lib/i18n-utils";
import { OUTPUTS } from "@/static/about";
import type { OutputKind } from "@/types/about";
import { cltw } from "@/util";
import SectionHeading from "../SectionHeading";

type OutputListProps = {
  locale: string;
};

// 種別ごとのバッジ色（執筆/登壇/選抜/主催）
const kindBadgeClasses = (kind: OutputKind) =>
  cltw(
    "px-2 py-0.5 text-[11px] font-mono shrink-0 mt-0.5 min-w-0",
    kind === "writing" && "bg-base-color/30 text-primary dark:bg-primary/30 dark:text-base-color",
    kind === "speaking" && "bg-secondary/20 text-secondary",
    kind === "selection" && "bg-light/50 text-txt-base dark:bg-light/20 dark:text-light",
    kind === "organize" && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  );

// 登壇・執筆・選抜・主催の一覧
const OutputList = ({ locale }: OutputListProps) => {
  const title = locale === "en" ? "Talks, writing, selections" : "登壇・執筆・選抜";

  return (
    <section aria-labelledby="outputs-heading">
      <SectionHeading id="outputs-heading" eyebrow="// Outputs" title={title} />
      <ul className="mt-8 space-y-4">
        {OUTPUTS.map((o) => {
          const titleText = pickLocalized(o.title, locale);
          return (
            <li key={o.id} className="flex items-start gap-3">
              <Chip label={outputKindLabel(o.kind, locale)} noTruncate classes={kindBadgeClasses(o.kind)} />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs text-gray-500 dark:text-gray-400">{o.date}</p>
                {o.url ? (
                  <a
                    href={o.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-words font-medium text-primary underline-offset-4 hover:underline dark:text-base-color"
                  >
                    {titleText}
                  </a>
                ) : (
                  <p className="break-words font-medium">{titleText}</p>
                )}
                {o.summary && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {pickLocalized(o.summary, locale)}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default OutputList;
