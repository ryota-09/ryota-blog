"use client"
import { cltw } from "@/util"
import { Link } from "next-view-transitions"
import { useSearchParams, usePathname } from "next/navigation"
import { ReactNode, useCallback } from "react"
import { generatePaginationHref } from "@/components/Pagination/generatePaginationHref"

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
    return generatePaginationHref({ pathname, searchParams, pageNumber, basePath })
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
