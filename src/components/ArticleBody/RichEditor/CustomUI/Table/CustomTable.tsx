import { type ComponentProps } from "react";

type CustomTableProps = ComponentProps<"table">

const CustomTable = ({ children, ...restProps }: CustomTableProps) => {
  return (
    <div className="flex overflow-x-scroll my-4 max-w-[768px]  sm:max-w-[1028px]">
      <table {...restProps} className="table-auto w-full indent-0 border-collapse border-inherit">
        {children}
      </table>
    </div>
  )
}
export default CustomTable;