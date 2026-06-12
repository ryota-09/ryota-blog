import { type ComponentProps } from "react";

type CustomTableProps = ComponentProps<"table">

const CustomTable = ({ children, ...restProps }: CustomTableProps) => {
  // NOTE: 固定px幅をやめ、利用可能な幅いっぱいに広げて横はみ出し時のみスクロールさせる
  return (
    <div className="flex my-4 w-full max-w-full overflow-x-auto">
      <table {...restProps} className="table-auto w-full indent-0 border-collapse border-inherit">
        {children}
      </table>
    </div>
  )
}
export default CustomTable;