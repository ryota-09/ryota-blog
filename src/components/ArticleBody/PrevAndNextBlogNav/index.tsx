import PrevAndNextBlogNavItem from "@/components/ArticleBody/PrevAndNextBlogNav/PrevAndNextNavItem";
import { getPrevAndNextBlogByLocale } from "@/lib/microcms";
import type { BlogsContentType } from "@/types/microcms";

type PrevAndNextBlogNavProps = {
  currentBlogData: BlogsContentType
  locale: string
}

const PrevAndNextBlogNav = async ({ currentBlogData, locale }: PrevAndNextBlogNavProps) => {
  const { prevBlogData, nextBlogData } = await getPrevAndNextBlogByLocale(locale, currentBlogData);
  return (
    <nav className="mt-4 grid grid-cols-2 divide-x-4 divide-white dark:divide-black">
      {prevBlogData ? <PrevAndNextBlogNavItem role="prev" data={prevBlogData} /> : <div className="max-w-1/2 py-4" />}
      {nextBlogData ? <PrevAndNextBlogNavItem role="next" data={nextBlogData} /> : <div className="max-w-1/2 py-4" />}
    </nav>
  )
}
export default PrevAndNextBlogNav;