"use client"

import { useContext, useRef, type FormEvent } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { GlobalContext } from "@/providers"
import { cltw } from "@/util"
import { escapeHtml } from "@/lib"
import { CATEGORY_MAPED_ID } from "@/static/blogs"

const SearchBar = () => {
  const { state } = useContext(GlobalContext)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const keyword = data.get('keyword')
    
    // Check if we're on a category page
    const categoryPathMatch = pathname.match(/^\/blogs\/([^\/]+)$/)
    const categoryId = categoryPathMatch ? categoryPathMatch[1] : null

    if (!keyword) {
      router.push(categoryId ? `/blogs/${categoryId}` : '/blogs')
      router.refresh()
      return
    }

    const escapedKeyword = escapeHtml(keyword.toString()).trim()

    if (categoryId) {
      formRef.current?.reset()
      router.push(`/blogs/${categoryId}?keyword=${escapedKeyword}`)
      router.refresh()
      return
    }

    formRef.current?.reset()
    router.push(`/blogs?keyword=${escapedKeyword}`)
    router.refresh()
  }

  return (
    <form ref={formRef} className="flex justify-center w-full" onSubmit={handleSubmit} data-testid="pw-search-bar">
      <input
        name="keyword"
        type="text"
        className={cltw("w-full px-4 py-2 border-2 transition-colors duration-500 dark:border-gray-600 dark:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-base-color dark:focus:ring-primary focus:border-transparent", state.blogType === "zenn" ? "bg-gray-300 cursor-not-allowed" : "bg-white")}
        placeholder={state.blogType === "zenn" ? "※ Zennの記事は検索非対応" : "Search..."}
        disabled={state.blogType === "zenn"}
        aria-disabled={state.blogType === "zenn"}
        data-testid="pw-search-bar-input"
      />
      <button
        type="submit"
        aria-label="検索"
        disabled={state.blogType === "zenn"}
        aria-disabled={state.blogType === "zenn"}
        className={cltw("text-white px-2 ml-2 block my-0.5 transition-all duration-500 rounded-sm ", state.blogType === "zenn" ? "bg-gray-500 cursor-not-allowed" : "bg-base-color hover:opacity-80 active:bg-secondary dark:bg-primary")}
        data-testid="pw-search-bar-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="10" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </form>
  )
}
export default SearchBar