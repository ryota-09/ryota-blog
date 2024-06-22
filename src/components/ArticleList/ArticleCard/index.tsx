import { Link } from 'next-view-transitions'

import { BlogsContentType } from "@/types/microcms"
import NewLabel from "@/components/UiParts/NewLabel"
import { isWithinTwoWeeks } from "@/util"
import Image from 'next/image'

type ArticleCardProps = {
  /**
   * ブログ記事のデータ
   */
  data: BlogsContentType
  /**
   * インデックス
   */
  index: number
}

const ArticleCard = ({ data, index }: ArticleCardProps) => {
  return (
    <div className="bg-white dark:bg-black border-2 border-gray-200 dark:dark:border-gray-600 p-6 h-[540px] md:h-[290px] flex flex-col relative">
      {isWithinTwoWeeks(data.publishedAt || data.updatedAt) && <NewLabel className="absolute -top-2.5 -left-2 md:-left-4" />}
      <Link href={`/blogs/${data.id}`} className="block h-[6rem] md:h-[5rem] lg:h-[4.5rem] text-lg md:text-xl leading-tight font-medium line-clamp-3 sm:line-clamp-2 transition duration-200 text-black dark:text-gray-300 hover:text-base-color dark:hover:text-primary" data-testid={`pw-card-title-${index}`} >{data.title}</Link>
      <div className="flex gap-4 flex-col-reverse md:flex-row overflow-hidden h-full">
        <div className="md:w-[70%] flex flex-col justify-between">
          <p className="mt-2 text-gray-500 h-[6rem] sm:h-auto line-clamp-4 sm:line-clamp-3 md:line-clamp-4">{data.description}</p>
          <div className="flex justify-end">
            <Link href={`/blogs/${data.id}`} className="mt-4 text-md md:text-xs md:text-md border-2 transition duration-200 border-base-color dark:border-primary text-base-color dark:text-light hover:bg-secondary dark:hover:bg-primary hover:text-white hover:border-secondary dark:hover:border-primary font-bold py-3 md:py-2 px-6 md:px-4">
              {/* NOTE: アクセシビリティの都合上、「続きを読む」は不適切判定なのでsr-onlyを付与 */}
              <span className="sr-only">{data.title}の</span>
              続きを読む
            </Link>
          </div>
        </div>
        {data.thumbnail ? (
          <div className="md:flex-shrink-0 md:w-[45%] lg:w-[28%] xl:w-[45%] mt-4 md:mt-2 max-h-[350px] sm:max-h-[300px] md:max-h-auto min-h-[220px] md:min-h-[140px] h-full overflow-hidden flex flex-col justify-center items-center">
            <Link href={`/blogs/${data.id}`} className='h-full w-full flex-grow flex justify-center items-center'>
              <figure className="transition-opacity hover:opacity-80">
                <Image
                  src={data.thumbnail.url}
                  alt={data.title}
                  width={data.thumbnail.width}
                  height={data.thumbnail.height}
                  sizes="100vw"
                  style={{
                    width: '100%',
                    height: 'auto'
                  }}
                  priority
                />
              </figure>
            </Link>
          </div>
        )
          :
          <div className="md:flex-shrink-0 md:w-[45%] lg:w-[28%] xl:w-[45%] mt-4 md:mt-2 max-h-[350px] sm:max-h-[300px] md:max-h-auto min-h-[220px] md:min-h-[140px] h-full flex flex-col items-center overflow-hidden">
            <Link href={`/blogs/${data.id}`} className='h-full w-full flex-grow flex items-center justify-center bg-gray-300 dark:bg-gray-600 transition-opacity hover:opacity-80'>
              <p className="w-auto text-gray-400 text-3xl font-bold" >No Image</p>
            </Link>
          </div>
        }
      </div>
    </div>
  )
}

export default ArticleCard