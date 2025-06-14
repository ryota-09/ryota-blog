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
          // Unwrap icon (horizontal arrows pointing outward)
          <>
            <path d="M7 6L2 6M2 6L5 3M2 6L5 9"></path>
            <path d="M17 6L22 6M22 6L19 3M22 6L19 9"></path>
            <path d="M2 18H22"></path>
          </>
        ) : (
          // Wrap icon (vertical bars with arrow)
          <>
            <path d="M3 6H21"></path>
            <path d="M3 12H15M15 12L12 9M15 12L12 15"></path>
            <path d="M3 18H21"></path>
          </>
        )}
      </svg>
    </button>
  )
}

export default WrapToggleButton