import { AUTHOR_DESCRIPTION, AUTHOR_DESCRIPTION_EN, AUTHOR_NAME, AUTHOR_NAME_EN } from "@/static/blogs";
import ImageWithSkeleton from "@/components/UiParts/ImageWithSkeleton";
import { useLocale } from 'next-intl';

const BottomCard = () => {
  const locale = useLocale();

  return (
    <>
      <div className="mx-6 flex shrink-0 items-center justify-center">
        <ImageWithSkeleton
          src="/author.png"
          alt="author"
          width={80}
          height={80}
          // 表示は常に80px固定。sizes="100vw"だとw=1536等の過大バリアントを取得してしまう
          sizes="80px"
          className="rounded-full"
          wrapperClassName=""
          skeletonClassName="rounded-full"
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
