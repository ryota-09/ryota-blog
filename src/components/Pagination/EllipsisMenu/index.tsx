import EllipsisMenuItem from "@/components/Pagination/EllipsisMenu/EllipsisMenuItem";
import { cltw } from "@/util";

type EllipsisMenuProps = {
  range: number[];
}

const EllipsisMenu = ({ range }: EllipsisMenuProps) => {
  return (
    <menu
      className={cltw("absolute -top-8 -left-4  mt-2 w-14 max-h-[145px] overflow-y-scroll scale-95 opacity-0 transition duration-200 ease-in-out rounded-md shadow-lg bg-white dark:bg-black ring-1 ring-black ring-opacity-5 group-hover:scale-100 group-hover:opacity-100 md:bg-gradient-to-t md:from-gray-200 dark:md:from-gray-400 md:to-5%")}
      role="menu"
    >
      <ul className="py-1">
        {range.map((page, index) => (
          <li key={index}>
            <EllipsisMenuItem pageNumber={page}>
              {page}
            </EllipsisMenuItem>
          </li>
        ))}
      </ul>
    </menu>
  );
}
export default EllipsisMenu