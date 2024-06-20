import { Link } from 'next-view-transitions';
import Chip from "@/components/UiParts/Chip";
import type { MappedKeyLiteralType } from "@/types/microcms";

type SearchStateCardProps = {
  /**
   * 検索キーワード
   */
  keyword?: string;
  /**
   * カテゴリー
   */
  category?: MappedKeyLiteralType
}

const SearchStateCard = ({ keyword, category }: SearchStateCardProps) => {
  return (
    <div className="bg-white dark:bg-black px-3.5 flex flex-grow flex-col lg:flex-row items-center gap-2 lg:gap-10 border-2 border-gray-200 dark:border-gray-600">
      <div className="flex items-center gap-2 w-full lg:w-auto">
        <svg className="text-gray-500 dark:text-gray-300 w-4 h-4 lg:w-8 lg:h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="10" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p className="text-sm lg:text-lg text-gray-500 dark:text-gray-300">検索条件 </p>
      </div>
      <div className="flex flex-col lg:flex-row flex-grow justify-between items-center gap w-full lg:w-auto">
        <ul className="flex gap-4 items-center">
          {category && (
            <li>
              <Chip classes=" text-xs lg:text-md bg-base-color dark:bg-primary px-3 py-2 text-sm text-txt-base dark:text-white" label={category} />
            </li>
          )}
          {keyword && (
            <li>
              <Chip classes="text-xs lg:text-md bg-light dark:bg-secondary px-3 py-2 text-sm text-txt-base dark:text-white" label={keyword} />
            </li>
          )}
        </ul>
        <div className="w-full lg:w-auto text-right">
          <Link href="/blogs" className="text-gray-400 text-xs cursor-pointer transition-colors hover:text-gray-700 dark:hover:text-gray-300">検索条件をリセット</Link>
        </div>
      </div>
    </div>
  )
}
export default SearchStateCard;