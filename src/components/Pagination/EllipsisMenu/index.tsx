import { cltw } from "@/util";

type EllipsisMenuProps = {
  range: number[];
}

const EllipsisMenu = ({ range }: EllipsisMenuProps) => {
  return (
    <div
      className={cltw("absolute -top-8 -left-4  mt-2 w-14 max-h-[118px] overflow-y-scroll scale-95 opacity-0 transition duration-200 ease-in-out rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 group-hover:scale-100 group-hover:opacity-100")}
    >
      <div className="py-1">
        {range.map(page => (
          <button
            key={page}
            className="block w-full text-left px-4 py-2 text-sm text-txt-base hover:bg-light hover:text-white"
          // onClick={() => onPageSelect(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
export default EllipsisMenu