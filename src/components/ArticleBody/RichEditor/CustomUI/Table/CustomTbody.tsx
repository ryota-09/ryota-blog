import { type HTMLAttributes } from "react";

type CustomTbodyProps = HTMLAttributes<HTMLTableSectionElement>

const CustomTbody = ({ children, ...restProps }: CustomTbodyProps) => {
  return (
    <tbody {...restProps} className="flex-none">
      {children}
    </tbody>
  )
}
export default CustomTbody;