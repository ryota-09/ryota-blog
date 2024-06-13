"use client"
import { cltw } from "@/util"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"

type PaginationItemProps = {
  currentPage: number
  pageNumber?: number
  children: ReactNode
}

const PaginationItem = ({ pageNumber, children, currentPage }: PaginationItemProps) => {
  const router = useRouter()

  const handleClick = () => {
    if (pageNumber === currentPage) return

    const pathNameWithQueryParams = window.location.pathname + window.location.search

    if (pathNameWithQueryParams.includes('keyword') || pathNameWithQueryParams.includes("category")) {
      // NOTE: ?category=チュートリアル&page=2&page=3&page=1 になるのを防ぐ
      router.push(`${pathNameWithQueryParams.replace(/&page=\d+/, '')}&page=${pageNumber}`)
      router.refresh()
      return
    }

    if (pageNumber === 1) {
      router.push('/blogs')
      router.refresh()
      return
    }

    router.push(`/blogs?page=${pageNumber}`)
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cltw("inline-flex h-8 w-8  items-center justify-center bg-white text-txt-base transition-colors hover:bg-light dark:hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-950 dark:text-gray-400 dark:focus:ring-base-color", pageNumber === currentPage ? 'bg-base-color dark:bg-secondary dark:text-gray-50' : 'bg-white dark:bg-black')}
      role="navigation"
      aria-label="ページネーションボタン"
    >
      {children}
    </button>
  )
}
export default PaginationItem