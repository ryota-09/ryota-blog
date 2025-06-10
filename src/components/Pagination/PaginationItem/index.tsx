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
}

const PaginationItem = ({ pageNumber, children, currentPage }: PaginationItemProps) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const generateHref = useCallback(() => {
    if (pageNumber === currentPage) return ""

    // Check if we're on a category page
    const categoryPathMatch = pathname.match(/^\/blogs\/([^\/]+)$/)
    const categoryId = categoryPathMatch ? categoryPathMatch[1] : null
    
    const keyword = searchParams.get('keyword') ?? ""
    
    let baseHref = categoryId ? `/blogs/${categoryId}` : `/blogs`

    if (keyword) {
      const currentPath = `${baseHref}?keyword=${keyword}`
      return `${currentPath}${pageNumber === 1 ? '' : `&page=${pageNumber}`}`
    }

    if (pageNumber === 1) {
      return baseHref
    }

    return `${baseHref}?page=${pageNumber}`
  }, [searchParams, pathname, pageNumber, currentPage])

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