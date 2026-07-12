import EllipsisMenuItem from "@/components/Pagination/EllipsisMenu/EllipsisMenuItem";
import { cltw } from "@/util";

type EllipsisMenuProps = {
  range: number[];
}

const EllipsisMenu = ({ range }: EllipsisMenuProps) => {
  // NOTE: 中身はページリンクの羅列なので素のリスト構造にする。
  // 以前は<menu role="menu">の直下に<ul>を置いていたが、ARIAのmenuロールは
  // 直下にmenuitem系以外の子を許可せず aria-required-children 違反になる
  // (menuロールはアプリケーションメニュー用途のためリンク一覧には不適)。
  return (
    <ul
      className={cltw("absolute -top-8 -left-4 mt-2 w-14 max-h-[145px] overflow-y-scroll py-1 scale-95 opacity-0 transition duration-200 ease-in-out rounded-md shadow-lg bg-white dark:bg-black ring-1 ring-black ring-opacity-5 group-hover:scale-100 group-hover:opacity-100 md:bg-gradient-to-t md:from-gray-200 dark:md:from-gray-400 md:to-5%")}
      data-testid="pw-ellipsis-menu"
    >
      {range.map((page, index) => (
        <li key={index}>
          <EllipsisMenuItem pageNumber={page}>
            {page}
          </EllipsisMenuItem>
        </li>
      ))}
    </ul>
  );
}
export default EllipsisMenu