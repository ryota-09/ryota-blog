"use client"
import { cltw } from "@/util"
import { ReactNode } from "react"

type PaginationItemProps = {
  pageNumber?: number
  currentPage: number
  children: ReactNode
  handleClick: () => void
}

const PaginationItem = ({ pageNumber, children, currentPage, handleClick }: PaginationItemProps) => {
  return (
    <button
      type="button"
      className={cltw("inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-txt-base transition-colors hover:bg-light hover:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-light dark:focus:ring-base-color", pageNumber === currentPage ? 'bg-base-color text-white' : 'bg-white')}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}
export default PaginationItem