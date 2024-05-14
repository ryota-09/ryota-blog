import { cltw } from "@/util"
import Link from "next/link"
import { ReactNode } from "react"

type PaginationItemProps = {
  currentPage: number
  pageNumber?: number
  children: ReactNode
}

const PaginationItem = ({ pageNumber, children, currentPage }: PaginationItemProps) => {
  return (
    <Link
      href={pageNumber === 1 ? '/blogs' : `/blogs?page=${pageNumber}`}
      className={cltw("inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-txt-base transition-colors hover:bg-light hover:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-light dark:focus:ring-base-color", pageNumber === currentPage ? 'bg-base-color text-white' : 'bg-white')}
    >
      {children}
    </Link>
  )
}
export default PaginationItem