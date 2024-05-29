"use client"

import ExternalLink from "@/components/UiParts/ExternalLink"
import { useSearchParams } from "next/navigation"

const Error = () => {
  const searchParams = useSearchParams()
  const url = searchParams.get('url')
  return (
    <div className="flex items-center border dark:border-gray-600 bg-white dark:bg-[#333] h-full">
      <ExternalLink href={url ?? ""} className="text-lg sm:text-2xl text-txt-base dark:text-gray-300 h-full w-full px-4 py-8 transition-opacity hover:opacity-70 dark:hover:opacity-80">
        {url}
      </ExternalLink>
    </div>
  )
}
export default Error