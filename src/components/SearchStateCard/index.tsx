import Link from "next/link";
import Chip from "@/components/UiParts/Chip";
import type { MappedKeyLiteralType } from "@/types/microcms";

type SearchStateCardProps = {
  keyword: string;
  category: MappedKeyLiteralType
}

const SearchStateCard = ({ keyword, category }: SearchStateCardProps) => {
  return (
    <div className="bg-white p-3.5 flex items-center gap-10 border-2 border-gray-200">
      <div className="flex items-center gap-2">
        <svg className="text-gray-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="10" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p className="text-lg text-gray-500">検索条件 </p>
      </div>
      <div className="flex flex-grow justify-between items-center">
        <ul className="flex gap-4">
          {category && (
            <li>
              <Chip classes="bg-base-color px-3 py-2 text-sm text-txt-base" label={category} />
            </li>
          )}
          {keyword && (
            <li>
              <Chip classes="bg-light px-3 py-2 text-sm text-txt-base" label={keyword} />
            </li>
          )}
        </ul>
        <div>
          <Link href="/blogs" className="text-gray-400 text-xs cursor-pointer transition-colors hover:text-gray-700">検索条件をリセット</Link>
        </div>
      </div>
    </div>
  )
}
export default SearchStateCard;