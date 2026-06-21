import { type ComponentProps } from "react";

type CustomTableProps = ComponentProps<"table">

const CustomTable = ({ children, ...restProps }: CustomTableProps) => {
  // NOTE: モバイルでテーブルの固有幅（whitespace-nowrapヘッダー由来）がページ幅を超えると、
  // 祖先のmx-auto flexアイテムがshrink-to-fitして横スクロールが発生していた。
  // コードブロック(MultiCodeBlock)と同じく viewport基準の確定max-width で
  // スクロールコンテナの幅を固定し、広いテーブルはこのボックス内でのみ横スクロールさせる。
  return (
    <div className="my-4 w-full max-w-[83vw] sm:max-w-[600px] md:max-w-[730px] lg:max-w-[1028px] overflow-x-auto">
      <table {...restProps} className="table-auto w-full indent-0 border-collapse border-inherit">
        {children}
      </table>
    </div>
  )
}
export default CustomTable;