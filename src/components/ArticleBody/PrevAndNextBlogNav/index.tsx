import PrevAndNextBlogNavItem from "@/components/ArticleBody/PrevAndNextBlogNav/PrevAndNextNavItem";
import { getPrevAndNextBlog } from "@/lib/microcms";
import type { BlogsContentType } from "@/types/microcms";

type PrevAndNextBlogNavProps = {
  currentBlogData: BlogsContentType
}

const PrevAndNextBlogNav = async ({ currentBlogData }: PrevAndNextBlogNavProps) => {
  const { prevBlogData, nextBlogData } = await getPrevAndNextBlog(currentBlogData);
  // data..."id,title,publishedAt,updatedAt"
  return (
    <nav className="grid grid-cols-2 divide-x-4 divide-white dark:divide-black">
      {prevBlogData && <PrevAndNextBlogNavItem role="prev" data={prevBlogData} />}
      {nextBlogData && <PrevAndNextBlogNavItem role="next" data={nextBlogData} />}
    </nav>
  )
}
export default PrevAndNextBlogNav;