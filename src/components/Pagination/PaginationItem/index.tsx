"use client"
import { cltw } from "@/util"
import { Link } from "next-view-transitions"
import { useRouter, useSearchParams } from "next/navigation"
import { ReactNode, useCallback } from "react"

type PaginationItemProps = {
  currentPage: number
  pageNumber?: number
  children: ReactNode
}

const PaginationItem = ({ pageNumber, children, currentPage }: PaginationItemProps) => {
  const searchParams = useSearchParams()

  const generateHref = useCallback(() => {
    const baseHref = `/blogs`
    if (pageNumber === currentPage) return ""

    const category = searchParams.get('category') ?? ""
    const keyword = searchParams.get('keyword') ?? ""

    if (category && keyword) {
      const currentPath = `${baseHref}?category=${category}&keyword=${keyword}`
      return `${currentPath}${pageNumber === 1 ? '' : `&page=${pageNumber}`}`
    } else if (category) {
      const currentPath = `${baseHref}?category=${category}`
      return `${currentPath}${pageNumber === 1 ? '' : `&page=${pageNumber}`}`
    } else if (keyword) {
      const currentPath = `${baseHref}?keyword=${keyword}`
      return `${currentPath}${pageNumber === 1 ? '' : `&page=${pageNumber}`}`
    }

    if (pageNumber === 1) {
      return baseHref
    }

    return `${baseHref}?page=${pageNumber}`
  }, [searchParams, pageNumber, currentPage])

  return (
    <Link
      href={generateHref()}
      className={cltw("inline-flex h-8 w-8  items-center justify-center bg-white text-txt-base transition-colors hover:bg-light dark:hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-950 dark:text-gray-400 dark:focus:ring-base-color", pageNumber === currentPage ? 'bg-base-color dark:bg-secondary dark:text-gray-50' : 'bg-white dark:bg-black')}
      role="navigation"
      aria-label="ページネーションボタン"
    >
      {children}
    </Link>
  )
}
export default PaginationItem