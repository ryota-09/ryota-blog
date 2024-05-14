import { type HTMLAttributes } from "react";

type CustomTrProps = HTMLAttributes<HTMLTableRowElement>

const CustomTr = ({ children, ...restProps }: CustomTrProps) => {
  return (
    <tr {...restProps}>
      {children}
    </tr>
  )
}
export default CustomTr;