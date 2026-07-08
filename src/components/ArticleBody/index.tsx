import ImageWithSkeleton from "@/components/UiParts/ImageWithSkeleton";

import ThumbnailCard from '@/components/ArticleBody/ThumbnailCard';
import BottomCard from '@/components/ArticleBody/BottomCard';
import FixedButton from '@/components/UiParts/FixedButton';
import type { BlogPost, ContentLocale } from '@/types/content';
import { buildPageUrl } from "@/lib";
import { getPrimaryCategoryIdFromBlogPost, buildTocAssets } from "@/lib/content";
import TOCList from "@/components/ArticleBody/TOCList";
import AdRevenueLabel from "@/components/AdRevenueLabel";
import PrevAndNextBlogNav from "@/components/ArticleBody/PrevAndNextBlogNav";
import IssueButton from "@/components/UiParts/IssueButton";
import { calcDiffYears, thumbnailPlaceholderProps } from "@/util";
import InfoYearsCard from "@/components/UiParts/InfoYearsCard";
import CategoryTag from "./CategoryTag";
import LocaleAwareShare from "./LocaleAwareShare";
import MdxContent from "@/components/ArticleBody/MdxContent";

type ArticleBodyProps = {
  data: BlogPost
  locale: ContentLocale
}

const ArticleBody = ({ data, locale }: ArticleBodyProps) => {
  const displayTime = data.publishedAt || data.updatedAt
  const categoryId = getPrimaryCategoryIdFromBlogPost(data);
  const tocData = buildTocAssets(data.toc);

  return (
    <div>
      <div className='md:w-[80%] mx-auto my-6 md:my-16'>
        {data.thumbnail
          ?
          <div className="flex flex-col gap-8">
            <h1 className="text-2xl md:text-3xl font-bold dark:text-gray-300">{data.title}</h1>
            <figure className="relative max-h-[300px] md:max-h-[540px] overflow-hidden shadow-2xl">
              <ImageWithSkeleton
                src={data.thumbnail.src}
                alt={data.title}
                width={data.thumbnail.width}
                height={data.thumbnail.height}
                // 一覧カードと同じblurプレースホルダーを使うことで、共有要素モーフ中に
                // グレーのスケルトンへ一瞬切り替わるちらつきを避ける
                {...thumbnailPlaceholderProps(data.thumbnail.blurDataURL)}
                // 実表示幅はコンテナmax-w-[1028px]×md:w-[80%]≈822pxが上限のため、
                // 100vw指定による過大バリアント(w=1280/1536)の取得を防ぐ
                sizes="(min-width: 1028px) 822px, (min-width: 768px) 80vw, 100vw"
                style={{
                  height: "auto",
                  width: "100%",
                  // 記事一覧のサムネイル画像と同じ名前を付け、遷移直後にサムネイルがそのままモーフするようにする
                  viewTransitionName: `thumb-${data.slug}`,
                }}
                loading="eager"
                preload
                // Next.js 16のpreloadはpreloadリンク出力のみでfetchpriorityを自動付与しないため、
                // LCP画像はfetchPriorityを明示してLowプライオリティ開始によるLoad delayを防ぐ
                fetchPriority="high"
              />
            </figure>
          </div>
          :
          <ThumbnailCard title={data.title} />
        }
      </div>
      <div className='mt-4'>
        <time dateTime={displayTime.split('T')[0]} className="text-gray-400">{displayTime.split('T')[0].replaceAll("-", "/")}</time>
      </div>
      {calcDiffYears(displayTime) >= 1 && (
        <aside className="mt-4">
          <InfoYearsCard diffYear={calcDiffYears(displayTime)} />
        </aside>
      )}
      <ul className='mt-4 flex flex-wrap gap-2'>
        {data.categories.map((id, index) => (
          <CategoryTag key={id} id={id} index={index} />
        ))}
      </ul>
      <div className="mt-4">
        <TOCList data={tocData} />
      </div>
      {data.isAdvertisement && (
        <aside className="mt-4">
          <AdRevenueLabel />
        </aside>
      )}
      {/* NOTE: w-full min-w-0 を明示しないと、内部のoverflow-x-autoコードブロック等の
          intrinsic width(実文字幅)がこのブロックのshrink-to-fit計算に伝播し、
          記事コンテナ全体が横に広がって不要な横スクロールが生じることがある(#242パリティ検証で発見)。 */}
      <div className='my-12 w-full min-w-0'>
        <MdxContent blog={data} />
      </div>
        <IssueButton currentPath={buildPageUrl(locale, "blogs", categoryId, data.slug)} />
        <PrevAndNextBlogNav currentBlogData={data} locale={locale} />
        <aside className='flex flex-col-reverse md:flex-row gap-8 md:gap-4 mx-0.5 border-t dark:border-t-[#333] py-10'>
          <BottomCard />
        </aside>
        <FixedButton />
        <LocaleAwareShare categoryId={categoryId} blogId={data.slug} title={data.title} />
    </div>
  )
}
export default ArticleBody;
