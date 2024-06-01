"use client"
import { cltw } from "@/util"
import { useState, type ReactNode } from "react"

type PopupModalProps = {
  children: ReactNode
}

const PopupModal = ({ children }: PopupModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div onClick={() => setIsOpen((prev) => !prev)} className={cltw(isOpen ? "cursor-zoom-out" : "cursor-zoom-in")}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-transform transform duration-300 ease-in-out">
          {children}
        </div>
      )}
    </div>
  )
}
export default PopupModal