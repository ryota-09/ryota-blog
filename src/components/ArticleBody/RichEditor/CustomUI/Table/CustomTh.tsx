import { type ComponentProps } from "react";

type CustomThProps = ComponentProps<"th">

const CustomTh = ({ children, ...restProps }: CustomThProps) => {
  return (
    <th {...restProps} className="border px-6 py-2 whitespace-nowrap">
      {children}
    </th>
  )
}
export default CustomTh;