import { AUTHOR_DESCRIPTION, AUTHOR_DESCRIPTION_EN, AUTHOR_NAME, AUTHOR_NAME_EN } from "@/static/blogs";
import Image from "next/image";
import { useLocale } from 'next-intl';

const BottomCard = () => {
  const locale = useLocale();
  
  return (
    <>
      <div className="mx-6 flex shrink-0 items-center justify-center">
        <Image
          src="/author.png"
          alt="author"
          width={80}
          height={80}
          sizes="100vw"
          className="rounded-full"
        />
      </div>
      <div>
        <p className="text-3xl font-bold dark:text-gray-300">
          {locale === 'en' ? AUTHOR_NAME_EN : AUTHOR_NAME}
        </p>
        <p className="mx-1 mt-4 text-gray-500 dark:text-gray-400">
          {locale === 'en' ? AUTHOR_DESCRIPTION_EN : AUTHOR_DESCRIPTION}
        </p>
      </div>
    </>
  );
};
export default BottomCard;
