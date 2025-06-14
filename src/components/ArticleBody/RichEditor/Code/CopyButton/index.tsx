"use client"

import { cltw } from "@/util"
import { useCallback, useState } from "react"

type CopyButtonProps = {
  text: string
}

const CopyButton = ({ text }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }, [text])

  return (
    <button 
      className='relative w-6 h-6 text-[#9ca4b5] cursor-pointer hover:text-[#b4bccf] transition-colors group'
      onClick={copyToClipboard}
      aria-label="コピー"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span className={cltw('absolute -bottom-6 left-1/2 -translate-x-1/2 text-[#9ca4b5] transition-opacity text-xs whitespace-nowrap bg-[#282a2e] px-2 py-1 rounded', isCopied ? "opacity-100" : "opacity-0")}>Copied!</span>
    </button>
  )
}
export default CopyButton