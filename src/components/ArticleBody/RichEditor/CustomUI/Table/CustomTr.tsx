import { type ComponentProps } from "react";

type CustomTrProps = ComponentProps<"tr">

const CustomTr = ({ children, ...restProps }: CustomTrProps) => {
  return (
    <tr {...restProps}>
      {children}
    </tr>
  )
}
export default CustomTr;