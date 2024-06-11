import { cltw } from "@/util"
import type { ReactNode } from "react"

type TooltipProps = {
  label: string
  children: ReactNode
  className?: string
}

const Tooltip = ({ label, children, className = "" }: TooltipProps) => {
  return (
    <div className="inline-block group relative">
      <span className={cltw("pointer-events-none -translate-x-1/2 left-1/2  opacity-0 transition before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent  before:content-[''] group-hover:opacity-100 group-hover:pointer-events-auto", className)}>
        {label}
      </span>
      {children}
    </div>
  )
}
export default Tooltip