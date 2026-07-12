import Chip from "@/components/UiParts/Chip";
import { pickLocalized } from "@/lib/i18n-utils";
import type { Project } from "@/types/about";

type ProjectCardProps = {
  project: Project;
  locale: string;
};

// プロジェクトカード（1件）
const ProjectCard = ({ project, locale }: ProjectCardProps) => {
  const title = pickLocalized(project.title, locale);
  const period = pickLocalized(project.period, locale);
  const role = pickLocalized(project.role, locale);
  const scale = pickLocalized(project.scale, locale);
  const rationale = pickLocalized(project.rationale, locale);

  const labels = {
    scale: locale === "en" ? "Scale" : "規模感",
    rationale: locale === "en" ? "Tech choices" : "技術選定理由",
  };

  return (
    <article className="flex h-full flex-col rounded border border-gray-200 bg-white p-5 transition-transform duration-200 hover:-translate-y-1 hover:border-base-color hover:shadow-lg dark:border-gray-700 dark:bg-black dark:hover:border-primary">
      <p className="font-mono text-xs text-gray-500 dark:text-gray-400">{period}</p>
      <h3 className="mt-2 text-base font-bold leading-snug">{title}</h3>
      <p className="mt-2 text-sm font-medium text-primary dark:text-base-color">{role}</p>

      <details className="mt-4">
        <summary className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold hover:text-primary dark:hover:text-base-color">
          <span aria-hidden className="transition-transform duration-200">›</span>
          {labels.scale}
        </summary>
        <ul className="mt-2 space-y-1 pl-4 text-sm text-gray-600 dark:text-gray-400">
          {scale.map((s) => (
            <li key={s}>・{s}</li>
          ))}
        </ul>
      </details>

      <details className="mt-2">
        <summary className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold hover:text-primary dark:hover:text-base-color">
          <span aria-hidden className="transition-transform duration-200">›</span>
          {labels.rationale}
        </summary>
        <ul className="mt-2 space-y-1 pl-4 text-sm text-gray-600 dark:text-gray-400">
          {rationale.map((r) => (
            <li key={r}>・{r}</li>
          ))}
        </ul>
      </details>

      <div className="mt-auto flex flex-wrap gap-1 pt-4">
        {project.stack.map((t) => (
          <Chip
            key={t}
            label={t}
            noTruncate
            classes="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-1.5 py-0.5 text-[10px] font-mono min-w-0"
          />
        ))}
      </div>
    </article>
  );
};

export default ProjectCard;
