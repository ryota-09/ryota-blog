// 全 about セクション共通の見出し
// eyebrow（コメント風小ラベル）＋ h2 タイトル ＋ 装飾線

type SectionHeadingProps = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
};

const SectionHeading = ({ id, eyebrow, title, description }: SectionHeadingProps) => {
  return (
    <header>
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.2em] text-primary dark:text-base-color font-mono">
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="mt-1 text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-snug">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">
          {description}
        </p>
      )}
      <span aria-hidden className="mt-3 block w-12 h-0.5 bg-base-color dark:bg-primary" />
    </header>
  );
};

export default SectionHeading;
