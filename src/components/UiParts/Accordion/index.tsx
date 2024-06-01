import { cltw } from "@/util"
import type { ReactNode } from "react"

type AccordionProps = {
  title: string
  children: ReactNode
  classes?: string
}

const Accordion = ({ title, children, classes }: AccordionProps) => {
  return (
    <details className="group">
      <summary className={cltw("list-none text-gray-400", classes)}>{title}</summary>
      {children}
    </details>
  )
}
export default Accordion
