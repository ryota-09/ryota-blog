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
    <div className='relative' onClick={toggleWrap}>
      <svg xmlns="http://www.w3.org/2000/svg" className='absolute right-2 top-2 w-6 h-6 text-[#9ca4b5] cursor-pointer' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {isWrapped ? (
          // Unwrap icon (horizontal arrows pointing outward)
          <>
            <path d="M8 18L12 22L16 18"></path>
            <path d="M8 6L12 2L16 6"></path>
            <path d="M2 12H22"></path>
          </>
        ) : (
          // Wrap icon (vertical bars with arrow)
          <>
            <path d="M3 6H21"></path>
            <path d="M3 12H15L12 9"></path>
            <path d="M12 15L15 12"></path>
            <path d="M3 18H21"></path>
          </>
        )}
      </svg>
      <span className={cltw('absolute right-10 top-2 text-[#9ca4b5] transition-opacity text-sm whitespace-nowrap', 'opacity-0 hover:opacity-100')}>
        {isWrapped ? '展開' : '折り返し'}
      </span>
    </div>
  )
}

export default WrapToggleButton