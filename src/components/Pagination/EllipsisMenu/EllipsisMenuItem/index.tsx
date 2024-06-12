"use client"

import { cltw } from "@/util"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

type EllipsisMenuItemProps = {
  pageNumber?: number
  children: ReactNode
}

const EllipsisMenuItem = ({ pageNumber, children }: EllipsisMenuItemProps) => {
  const router = useRouter()

  const handleClick = () => {
    const pathNameWithQueryParams = window.location.pathname + window.location.search

    if (pathNameWithQueryParams.includes('keyword') || pathNameWithQueryParams.includes("category")) {
      // NOTE: ?category=チュートリアル&page=2&page=3&page=1 になるのを防ぐ
      router.push(`${pathNameWithQueryParams.replace(/&page=\d+/, '')}&page=${pageNumber}`)
      router.refresh()
      return
    }

    router.push(`/blogs?page=${pageNumber}`)
    router.refresh()
  }

  return (
    <button
      className={cltw("block w-full text-left px-4 py-2 text-md text-txt-base dark:text-gray-400 hover:bg-light dark:hover:bg-secondary hover:text-white")}
      onClick={handleClick}
      role="navigation"
      aria-label="ページネーションボタン"
    >
      {children}
    </button>
  )
}
export default EllipsisMenuItem