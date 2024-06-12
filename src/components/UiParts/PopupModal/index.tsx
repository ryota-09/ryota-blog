"use client"
import { useState, type ReactNode } from "react"

import { useKey } from "@/hooks/keybord"
import { cltw } from "@/util"

type PopupModalProps = {
  /**
   * モーダルのコンテンツ
   */
  children: ReactNode
}

const PopupModal = ({ children }: PopupModalProps) => {
  const [isOpen, setIsOpen] = useState(false)

  useKey("Escape", () => {
    setIsOpen(false)
  })

  return (
    <div onClick={() => setIsOpen((prev) => !prev)} className={cltw(isOpen ? "cursor-zoom-out" : "cursor-zoom-in")}>
      {children}
      <div className={cltw("transition-transform transform duration-300 ease-in-out", isOpen ? "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 opacity-100 scale-125 h-auto" : "scale-100 opacity-0 h-0 w-0")}>
        {children}
      </div>
    </div>
  )
}
export default PopupModal