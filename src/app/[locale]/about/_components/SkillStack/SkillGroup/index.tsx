import Chip from "@/components/UiParts/Chip";
import { pickLocalized } from "@/lib/i18n-utils";
import type { SkillGroup as SkillGroupType, SkillLevel } from "@/types/about";
import { cltw } from "@/util";

type SkillGroupProps = {
  level: SkillLevel;
  groups: SkillGroupType[];
  label: string;
  locale: string;
};

// レベル別タグの見た目を返す（main / sub / learning で視覚差をつける）
const tagClasses = (level: SkillLevel) =>
  cltw(
    "px-2.5 py-1 text-sm min-w-0",
    level === "main" &&
      "bg-base-color/20 text-txt-base dark:bg-primary/30 dark:text-gray-100 font-medium",
    level === "sub" && "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    level === "learning" &&
      "opacity-80 border border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400",
  );

// スキルグループ（レベル1個ぶん）
const SkillGroup = ({ level, groups, label, locale }: SkillGroupProps) => {
  return (
    <div>
      <h3 className="mb-3 font-mono text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">
        {label}
      </h3>
      <div className="space-y-3">
        {groups.map((g) => (
          <div key={pickLocalized(g.category, locale)}>
            <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
              {pickLocalized(g.category, locale)}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((item) => (
                <Chip key={item} label={item} noTruncate classes={tagClasses(level)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillGroup;
