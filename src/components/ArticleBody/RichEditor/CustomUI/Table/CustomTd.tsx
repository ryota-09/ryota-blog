import { type HTMLAttributes } from "react";

type CustomTrProps = HTMLAttributes<HTMLTableCellElement>

const CustomTd = ({ children, ...restProps }: CustomTrProps) => {
  return (
    <td {...restProps} className="border px-6 py-2">
      {children}
    </td>
  )
}
export default CustomTd;