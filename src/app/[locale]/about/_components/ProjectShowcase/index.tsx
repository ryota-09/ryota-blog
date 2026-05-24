import { pickLocalized } from "@/lib/i18n-utils";
import { OTHER_PROJECTS, PROJECTS } from "@/static/about";
import SectionHeading from "../SectionHeading";
import ProjectCard from "./ProjectCard";

type ProjectShowcaseProps = {
  locale: string;
};

// 主な実績（3カード）＋ そのほかの実績（details で折りたたみ）
const ProjectShowcase = ({ locale }: ProjectShowcaseProps) => {
  const title = locale === "en" ? "Selected projects" : "主な実績";
  const othersLabel = locale === "en" ? "Show other engagements" : "そのほかの実績を見る";

  return (
    <section aria-labelledby="projects-heading">
      <SectionHeading id="projects-heading" eyebrow="// Projects" title={title} />
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} project={p} locale={locale} />
        ))}
      </div>
      <details className="group mt-8">
        <summary className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-primary dark:text-base-color hover:underline underline-offset-4">
          {othersLabel}
          <span aria-hidden className="transition-transform duration-200 group-open:rotate-90">›</span>
        </summary>
        <ul className="mt-4 max-w-prose space-y-3 text-sm text-gray-700 dark:text-gray-300">
          {OTHER_PROJECTS.map((o) => (
            <li key={o.id}>
              <strong>{pickLocalized(o.title, locale)}</strong> — {pickLocalized(o.summary, locale)}
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
};

export default ProjectShowcase;
