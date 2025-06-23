import SocialMediaIcons from "@/components/Header/SocialMediaIcons";
import Chip from "@/components/UiParts/Chip";
import ImageWithBlur from "@/components/UiParts/ImageWithBlur";
import { AUTHOR_DESCRIPTION, AUTHOR_DESCRIPTION_EN, AUTHOR_NAME, AUTHOR_NAME_EN } from "@/static/blogs";
import { setRequestLocale } from 'next-intl/server';

interface AboutPageProps {
  params: {
    locale: string;
  };
}

const Page = ({ params: { locale } }: AboutPageProps) => {
  setRequestLocale(locale);
  
  const authorName = locale === 'en' ? AUTHOR_NAME_EN : AUTHOR_NAME;
  const authorDescription = locale === 'en' ? AUTHOR_DESCRIPTION_EN : AUTHOR_DESCRIPTION;
  
  return (
    <article className="flex h-full min-h-[600px] w-full flex-grow flex-col items-center justify-center gap-8 border-2 border-gray-200 bg-white px-8 md:flex-row md:justify-between dark:border-gray-600 dark:bg-black">
      <div className="flex flex-col items-start space-y-8">
        <Chip
          label={"Software Engineer"}
          classes="bg-light dark:bg-primary py-1 px-3 text-txt-base"
        />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl dark:text-gray-300">
          {authorName}
        </h1>
        <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          {authorDescription}
        </p>
        <SocialMediaIcons locale={locale} />
      </div>
      <figure>
        <ImageWithBlur
          src="/author.png"
          alt={authorName}
          className="mx-auto block aspect-square w-[200px] overflow-hidden rounded-full object-cover shadow-2xl md:w-[400px]"
          width={400}
          height={400}
        />
      </figure>
    </article>
  );
};
export default Page;