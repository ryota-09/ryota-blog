import { type HTMLAttributes } from "react";

type CustomTrProps = HTMLAttributes<HTMLTableCellElement>

const CustomTh = ({ children, ...restProps }: CustomTrProps) => {
  return (
    <th {...restProps} className="border px-6 py-2 whitespace-nowrap">
      {children}
    </th>
  )
}
export default CustomTh;