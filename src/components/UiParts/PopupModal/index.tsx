"use client"
import { useState, type ReactNode } from "react"
import { useKey } from "@/hooks/keybord"
import { cltw } from "@/util"

type PopupModalProps = {
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
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="transition-transform transform duration-300 ease-in-out w-[90vw]">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
export default PopupModal