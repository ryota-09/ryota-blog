import { cltw } from "@/util"
import { ReactNode } from "react"

type AccordionProps = {
  title: string
  children: ReactNode
  classes?: string
}

const Accordion = ({ title, children, classes }: AccordionProps) => {
  return (
    <details className="group">
      <summary className={cltw("list-none text-gray-400",classes)}>{title}</summary>
      {children}
    </details>
  )
}
export default Accordion

{/* <details class="group">
  <summary class="col-span-2 xl:col-span-3 w-full p-4 cursor-pointer text-center transition hover:bg-blue-100 hover:opacity-70 duration-300 ">
    もっと見る
  </summary>
  <ul class="grid grid-cols-2 xl:grid-cols-3 gap-8 ">
    <!-- Replace this with your data mapping -->
    <li class="p-4 border">Item 1</li>
    <li class="p-4 border">Item 2</li>
    <li class="p-4 border">Item 3</li>
    <li class="p-4 border">Item 4</li>
    <li class="p-4 border">Item 5</li>
    <li class="p-4 border">Item 6</li>
  </ul>
</details> */}
