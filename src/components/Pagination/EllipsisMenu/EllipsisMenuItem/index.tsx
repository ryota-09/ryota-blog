"use client"
import { Link } from "next-view-transitions"
import { useSearchParams } from "next/navigation"
import { useCallback, type ReactNode } from "react"
import { cltw } from "@/util"

type EllipsisMenuItemProps = {
  pageNumber?: number
  children: ReactNode
}

const EllipsisMenuItem = ({ pageNumber, children }: EllipsisMenuItemProps) => {
  const searchParams = useSearchParams()

  const generateHref = useCallback(() => {
    const baseHref = `/blogs`

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
  }, [searchParams, pageNumber])

  return (
    <Link
      href={generateHref()}
      className={cltw("block w-full text-left px-4 py-2 text-md text-txt-base dark:text-gray-400 hover:bg-light dark:hover:bg-secondary hover:text-white")}
      role="navigation"
      aria-label="ページネーションボタン"
    >
      {children}
    </Link>
  )
}
export default EllipsisMenuItem