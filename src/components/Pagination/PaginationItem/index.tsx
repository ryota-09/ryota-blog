"use client"
import { cltw } from "@/util"
import { Link } from "next-view-transitions"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ReactNode, useCallback } from "react"
import { CATEGORY_MAPED_ID } from "@/static/blogs"

type PaginationItemProps = {
  currentPage: number
  pageNumber?: number
  children: ReactNode
  basePath?: string
}

const PaginationItem = ({ pageNumber, children, currentPage, basePath }: PaginationItemProps) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const generateHref = useCallback(() => {
    if (pageNumber === currentPage) return ""

    // サーバーサイドでbasePathが提供されている場合はそれを使用
    if (basePath) {
      if (pageNumber === 1) {
        return basePath
      }
      return `${basePath}/page/${pageNumber}`
    }

    // 国際化対応: カテゴリページかどうかを確認
    const categoryPathMatch = pathname?.match(/^\/([^\/]+)\/blogs\/([^\/]+)$/)
    const locale = categoryPathMatch ? categoryPathMatch[1] : pathname?.match(/^\/([^\/]+)/)?.[1] || 'ja'
    const categoryId = categoryPathMatch ? categoryPathMatch[2] : null
    
    const keyword = searchParams?.get('keyword') ?? ""
    
    let baseHref = categoryId ? `/${locale}/blogs/${categoryId}` : `/${locale}/blogs`

    if (keyword) {
      const currentPath = `${baseHref}?keyword=${keyword}`
      return `${currentPath}${pageNumber === 1 ? '' : `&page=${pageNumber}`}`
    }

    if (pageNumber === 1) {
      return baseHref
    }

    // 新しいパスベースのページネーション形式を使用
    return `${baseHref}/page/${pageNumber}`
  }, [searchParams, pathname, pageNumber, currentPage, basePath])

  return (
    <Link
      href={generateHref()}
      className={cltw("inline-flex h-8 w-8  items-center justify-center bg-white text-txt-base transition-colors  focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-950 dark:text-gray-400 dark:focus:ring-base-color", pageNumber === currentPage ? 'bg-base-color dark:bg-secondary dark:text-gray-50' : 'bg-white dark:bg-black hover:bg-light dark:hover:bg-primary hover:text-white')}
    >
      {children}
    </Link>
  )
}
export default PaginationItem