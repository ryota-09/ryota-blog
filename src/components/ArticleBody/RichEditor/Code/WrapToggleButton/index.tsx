"use client"

import { cltw } from "@/util"
import { useCallback, useState } from "react"

type WrapToggleButtonProps = {
  onToggleWrap: (isWrapped: boolean) => void
}

const WrapToggleButton = ({ onToggleWrap }: WrapToggleButtonProps) => {
  const [isWrapped, setIsWrapped] = useState(false)

  const toggleWrap = useCallback(() => {
    const newWrappedState = !isWrapped
    setIsWrapped(newWrappedState)
    onToggleWrap(newWrappedState)
  }, [isWrapped, onToggleWrap])

  return (
    <button 
      className='relative w-6 h-6 text-[#9ca4b5] cursor-pointer hover:text-[#b4bccf] transition-colors'
      onClick={toggleWrap}
      aria-label={isWrapped ? '展開' : '折り返し'}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {isWrapped ? (
          // Unwrap icon - 一行の長いテキストを表現
          <>
            <rect x="3" y="6" width="18" height="2" rx="1"></rect>
            <rect x="3" y="11" width="18" height="2" rx="1"></rect>
            <rect x="3" y="16" width="18" height="2" rx="1"></rect>
          </>
        ) : (
          // Wrap icon - 改行される矢印（VS Code風）
          <>
            <path d="M3 6h18"></path>
            <path d="M3 12h12"></path>
            <path d="M3 18h18"></path>
            <path d="M15 9v6h4"></path>
            <path d="M17 13l2 2-2 2"></path>
          </>
        )}
      </svg>
    </button>
  )
}

export default WrapToggleButton