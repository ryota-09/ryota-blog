import EllipsisMenu from "@/components/Pagination/EllipsisMenu"
import PaginationItem from "@/components/Pagination/PaginationItem"
import { PER_PAGE } from "@/static/blogs"

const MINIMUM_PAGE_COUNT = 1;
const INDEX_OFFSET = 1;
const SMALL_RANGE_START_OFFSET = 1;
const SMALL_RANGE_END_OFFSET = 2;
const LARGE_RANGE_START_OFFSET = 1;
const LARGE_RANGE_END_OFFSET = 1;

type PaginationProps = {
  /**
   * 現在のページ番号 (クエリ例: ?page=1)
   */
  currentPage: number
  /**
   * 総コンテンツ数
   */
  totalCount: number
}

const Pagination = ({ currentPage, totalCount }: PaginationProps) => {
  const rate = totalCount / PER_PAGE;
  const totalPages = rate < MINIMUM_PAGE_COUNT ? MINIMUM_PAGE_COUNT : Math.ceil(rate);

  const previousPageRange = Array.from({ length: totalPages + INDEX_OFFSET })
    .map((_, index) => index + INDEX_OFFSET)
    .slice(SMALL_RANGE_START_OFFSET, currentPage - SMALL_RANGE_END_OFFSET);
  const nextPageRange = Array.from({ length: totalPages + INDEX_OFFSET })
    .map((_, index) => index + INDEX_OFFSET)
    .slice(currentPage + LARGE_RANGE_START_OFFSET, totalPages - LARGE_RANGE_END_OFFSET);

  return (
    totalCount !== 0 && (
      <ul className="flex items-center gap-2">
        {/* NOTE: 1ページ目以外、前のページを表示するボタン */}
        {currentPage !== 1 && (
          <li>
            <PaginationItem pageNumber={currentPage - 1} currentPage={currentPage} >
              <svg
                className="-scale-x-90"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </PaginationItem>
          </li>
        )}
        {/* NOTE: １ページ目を表すボタン */}
        <li>
          <PaginationItem pageNumber={1} currentPage={currentPage}>1</PaginationItem>
        </li>
        {/* NOTE: 4ページ目以降の場合、省略ボタンを表示し、ホバー時にメニューを表示する */}
        {currentPage >= 4 &&
          <li className="relative group mx-6">
            <button type="button">
              <span>...</span>
            </button>
            <EllipsisMenu range={previousPageRange} />
          </li>
        }
        {/* NOTE: ３ページ目以降の場合、１ページ前のページを表示するためのボタン */}
        {currentPage >= 3 && (
          <li>
            <PaginationItem pageNumber={currentPage - 1} currentPage={currentPage}>{currentPage - 1}</PaginationItem>
          </li>
        )}
        {/* NOTE: 現在のページを表すボタン。常時、アクティブになる。 */}
        {currentPage !== 1 && currentPage !== totalPages && (
          <li>
            <PaginationItem pageNumber={currentPage} currentPage={currentPage}>{currentPage}</PaginationItem>
          </li>
        )}
        {/* NOTE: 現在のページの次のページを表すボタン */}
        {currentPage < totalPages && currentPage + 1 !== totalPages && (
          <li>
            <PaginationItem pageNumber={currentPage + 1} currentPage={currentPage}>{currentPage + 1}</PaginationItem>
          </li>
        )}
        {/* NOTE: 最後から３ページ目以前の場合、省略ボタンを表示し、ホバー時にメニューを表示する */}
        {currentPage <= totalPages - 3 &&
          <li className="relative group mx-6">
            <button type="button">
              <span>...</span>
            </button>
            <EllipsisMenu range={nextPageRange} />
          </li>
        }
        {/* NOTE: 最後のページを表すボタン */}
        {totalPages !== 1 && (
          <li>
            <PaginationItem pageNumber={totalPages} currentPage={currentPage} >{totalPages}</PaginationItem>
          </li>
        )}
        {/* NOTE: 最後のページ以外、次のページを表示するボタン */}
        {currentPage !== totalPages && (
          <li>
            <PaginationItem pageNumber={currentPage + 1} currentPage={currentPage} >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </PaginationItem>
          </li>
        )}
      </ul>

    )
  )
}
export default Pagination