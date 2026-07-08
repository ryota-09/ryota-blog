import PrevAndNextBlogNavItem from "@/components/ArticleBody/PrevAndNextBlogNav/PrevAndNextNavItem";
import { getPrevAndNextBlogByLocale } from "@/lib/content";
import { toBlogPostSummary } from "@/lib/content-utils";
import type { BlogPost, ContentLocale } from "@/types/content";

type PrevAndNextBlogNavProps = {
  currentBlogData: Pick<BlogPost, "publishedAt">
  locale: ContentLocale
}

// content.tsのgetPrevAndNextBlogByLocaleは同期関数(Velite由来のインメモリ配列を走査するだけ)のため、
// 非同期(microCMS API呼び出し)だった現行版と異なりasyncは不要
const PrevAndNextBlogNav = ({ currentBlogData, locale }: PrevAndNextBlogNavProps) => {
  const { prevBlogData, nextBlogData } = getPrevAndNextBlogByLocale(locale, currentBlogData);
  return (
    <nav className="mt-4 grid grid-cols-2 divide-x-4 divide-white dark:divide-black">
      {/* クライアント境界を越える前にbody/raw等の重量フィールドを落とす(RSCペイロード肥大防止) */}
      {prevBlogData ? <PrevAndNextBlogNavItem role="prev" data={toBlogPostSummary(prevBlogData)} /> : <div className="max-w-1/2 py-4" />}
      {nextBlogData ? <PrevAndNextBlogNavItem role="next" data={toBlogPostSummary(nextBlogData)} /> : <div className="max-w-1/2 py-4" />}
    </nav>
  )
}
export default PrevAndNextBlogNav;