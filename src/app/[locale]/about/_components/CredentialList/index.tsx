import { pickLocalized } from "@/lib/i18n-utils";
import { CREDENTIALS, CREDENTIALS_NOTE } from "@/static/about";
import SectionHeading from "../SectionHeading";

type CredentialListProps = {
  locale: string;
};

// 保有資格セクション
const CredentialList = ({ locale }: CredentialListProps) => {
  const title = locale === "en" ? "Credentials" : "保有資格";
  const externalAriaLabel = locale === "en" ? "Opens in new tab" : "新しいタブで開きます";

  return (
    <section aria-labelledby="credentials-heading">
      <SectionHeading id="credentials-heading" eyebrow="// Credentials" title={title} />
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {CREDENTIALS.map((c) => {
          const inner = (
            <>
              <span aria-hidden className="text-primary dark:text-base-color">🏅</span>
              <div>
                <p className="text-sm font-semibold leading-snug">{pickLocalized(c.title, locale)}</p>
                <p className="mt-1 font-mono text-xs text-gray-500 dark:text-gray-400">{c.acquiredAt}</p>
              </div>
            </>
          );
          return (
            <li key={c.id}>
              {c.url ? (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${pickLocalized(c.title, locale)}（${externalAriaLabel}）`}
                  className="flex items-start gap-3 rounded border border-gray-200 p-4 transition-colors duration-200 hover:border-base-color dark:border-gray-700 dark:hover:border-primary"
                >
                  {inner}
                </a>
              ) : (
                <div className="flex items-start gap-3 rounded border border-gray-200 p-4 dark:border-gray-700">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-6 max-w-prose text-sm italic text-gray-600 dark:text-gray-400">
        {pickLocalized(CREDENTIALS_NOTE, locale)}
      </p>
    </section>
  );
};

export default CredentialList;
