import { type ComponentProps } from "react";

type CustomTrProps = ComponentProps<"td">

const CustomTd = ({ children, ...restProps }: CustomTrProps) => {
  return (
    <td {...restProps} className="border px-6 py-2">
      {children}
    </td>
  )
}
export default CustomTd;