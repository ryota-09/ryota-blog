"use client"
import { Link } from "next-view-transitions"
import { useSearchParams, usePathname } from "next/navigation"
import { useCallback, type ReactNode } from "react"
import { cltw } from "@/util"
import { generatePaginationHref } from "@/components/Pagination/generatePaginationHref"

type EllipsisMenuItemProps = {
  pageNumber?: number
  children: ReactNode
}

const EllipsisMenuItem = ({ pageNumber, children }: EllipsisMenuItemProps) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const generateHref = useCallback(() => {
    return generatePaginationHref({ pathname, searchParams, pageNumber })
  }, [searchParams, pathname, pageNumber])

  return (
    // NOTE: 親がrole="menu"だった時代はrole="menuitem"を付けていたが、
    // 親を素のリスト構造に是正したため、通常のリンクとしてrole指定なしで描画する
    <Link
      href={generateHref()}
      className={cltw("block w-full text-left px-4 py-2 text-md text-txt-base dark:text-gray-400 hover:bg-light dark:hover:bg-secondary hover:text-white")}
    >
      {children}
    </Link>
  )
}
export default EllipsisMenuItem
