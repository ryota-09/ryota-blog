import { type ComponentProps } from "react";

type CustomTableProps = ComponentProps<"table">

const CustomTable = ({ children, ...restProps }: CustomTableProps) => {
  return (
    <div className="flex my-4 overflow-scroll max-w-[260px] sm:max-w-[540px] md:max-w-[768px]">
      <table {...restProps} className="table-auto w-full indent-0 border-collapse border-inherit">
        {children}
      </table>
    </div>
  )
}
export default CustomTable;