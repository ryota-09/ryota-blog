import { type ComponentProps } from "react";

type CustomTbodyProps = ComponentProps<"tbody">

const CustomTbody = ({ children, ...restProps }: CustomTbodyProps) => {
  return (
    <tbody {...restProps} className="flex-none">
      {children}
    </tbody>
  )
}
export default CustomTbody;