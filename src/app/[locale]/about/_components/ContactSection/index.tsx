import { FileText, Mail, MessageSquare } from "lucide-react";
import { pickLocalized } from "@/lib/i18n-utils";
import { CONTACT } from "@/static/about";
import type { ContactChannelKind } from "@/types/about";
import SectionHeading from "../SectionHeading";

type ContactSectionProps = {
  locale: string;
};

// 連絡手段ごとのアイコン
const iconFor = (kind: ContactChannelKind) => {
  if (kind === "email") return Mail;
  if (kind === "form") return FileText;
  return MessageSquare;
};

// 連絡・お仕事相談セクション
const ContactSection = ({ locale }: ContactSectionProps) => {
  const intro = pickLocalized(CONTACT.intro, locale);
  const accepted = pickLocalized(CONTACT.acceptedTopics, locale);
  const declined = pickLocalized(CONTACT.declinedTopics, locale);
  const labels = {
    title: locale === "en" ? "Contact" : "連絡・お仕事のご相談",
    accepted: locale === "en" ? "Welcome to discuss" : "得意な相談ジャンル",
    declined: locale === "en" ? "Not the best fit" : "お受けしづらいもの",
    responseSla: locale === "en" ? "Response time" : "返信目安",
  };

  return (
    <section aria-labelledby="contact-heading">
      <SectionHeading id="contact-heading" eyebrow="// Contact" title={labels.title} />
      <div className="mt-8 grid gap-8 md:grid-cols-[2fr_1fr]">
        <div className="max-w-prose space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          {intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div className="mt-6">
            <p className="mb-2 font-semibold text-gray-900 dark:text-gray-100">{labels.accepted}</p>
            <ul className="space-y-1.5 text-sm">
              {accepted.map((t) => (
                <li key={t} className="flex gap-2">
                  <span aria-hidden className="text-base-color dark:text-primary">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <p className="mb-2 font-semibold text-gray-500">{labels.declined}</p>
            <ul className="space-y-1.5 text-sm text-gray-500">
              {declined.map((t) => (
                <li key={t} className="flex gap-2">
                  <span aria-hidden>×</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <aside className="space-y-3">
          {CONTACT.channels.map((c) => {
            const extraAttrs =
              c.kind === "email"
                ? {}
                : { target: "_blank" as const, rel: "noopener noreferrer" as const };
            const Icon = iconFor(c.kind);
            return (
              <a
                key={c.kind}
                href={c.href}
                {...extraAttrs}
                className="flex items-center gap-3 rounded border border-gray-200 p-4 transition-colors duration-200 hover:border-base-color dark:border-gray-700 dark:hover:border-primary"
              >
                <Icon
                  aria-hidden
                  className="h-5 w-5 shrink-0 text-primary dark:text-base-color"
                />
                <div className="min-w-0">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-500">{c.kind}</p>
                  <p className="mt-1 font-medium">{pickLocalized(c.label, locale)}</p>
                </div>
              </a>
            );
          })}
          <p className="mt-4 font-mono text-xs text-gray-500">
            {labels.responseSla}: {pickLocalized(CONTACT.responseSla, locale)}
          </p>
        </aside>
      </div>
    </section>
  );
};

export default ContactSection;
