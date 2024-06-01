import { Link } from "next-view-transitions";

import type { BlogsContentType } from "@/types/microcms";
import { cltw } from "@/util";

type PrevAndNextBlogNavItemProps = {
  role: "prev" | "next"
  data: Pick<BlogsContentType, "id" | "title" | "publishedAt" | "updatedAt">
}

const PrevAndNextBlogNavItem = async ({role, data }: PrevAndNextBlogNavItemProps) => {
  const displayTime = data.publishedAt || data.updatedAt
  return (
    <Link href={`/blogs/${data.id}`} className={cltw("max-w-1/2 py-4 transition text-gray-400 dark:text-gray-500 underline underline-offset-4 hover:opacity-70 hover:text-base-color hover:no-underline", role === "prev" ? "text-left" : "text-right")}>
      <span>{role === "prev" ? "前の記事" : "次の記事"}</span>
      <time dateTime={displayTime.split('T')[0]}>({displayTime.split('T')[0]})</time><br />
      <span className=" line-clamp-1">{data.title}</span>
    </Link>
  )
}
export default PrevAndNextBlogNavItem;