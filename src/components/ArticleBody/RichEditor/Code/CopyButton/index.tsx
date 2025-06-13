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
    <div className='relative' onClick={copyToClipboard}>
      <svg xmlns="http://www.w3.org/2000/svg" className='absolute right-2 top-2 w-6 h-6 text-[#9ca4b5] cursor-pointer' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span className={cltw('absolute right-10 top-2 text-[#9ca4b5] transition-opacity text-sm', isCopied ? "opacity-100" : "opacity-0")}>Copied!</span>
    </div>
  )
}
export default CopyButton