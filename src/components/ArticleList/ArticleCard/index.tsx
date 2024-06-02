import Image from "next/image"
import { Link } from 'next-view-transitions'

import { BlogsContentType } from "@/types/microcms"

type ArticleCardProps = {
  data: BlogsContentType
}

const ArticleCard = ({ data }: ArticleCardProps) => {
  return (
    <div className="bg-white dark:bg-black border-2 border-gray-200 dark:dark:border-gray-600 overflow-hidden p-6 h-full flex flex-col">
      <Link href={`/blogs/${data.id}`} className="block text-lg md:text-xl leading-tight font-medium transition duration-200 text-black dark:text-gray-300 hover:text-base-color dark:hover:text-primary">{data.title}</Link>
      <div className="flex gap-4 h-full flex-col-reverse md:flex-row">
        <div className="md:w-[70%] flex flex-col justify-between">
          <p className="mt-2 text-gray-500 line-clamp-3">{data.description}</p>
          <div className="flex justify-end">
            <Link href={`/blogs/${data.id}`} className="mt-4 text-md md:text-xs md:text-md border-2 transition duration-200 border-base-color dark:border-primary text-base-color dark:text-light hover:bg-secondary dark:hover:bg-primary hover:text-white hover:border-secondary dark:hover:border-primary font-bold py-3 md:py-2 px-6 md:px-4">
              続きを読む
            </Link>
          </div>
        </div>
        {data.thumbnail ? (
          <div className="md:flex-shrink-0 md:w-[45%] lg:w-[28%] xl:w-[45%] mt-4 md:mt-2 max-h-[250px] md:max-h-auto overflow-hidden flex justify-center items-center">
            <Link href={`/blogs/${data.id}`}>
              <figure className="transition-opacity hover:opacity-80">
                <Image
                  src={data.thumbnail.url}
                  alt={data.title}
                  width={data.thumbnail.width}
                  height={data.thumbnail.height}
                  sizes="100vw"
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                  priority
                />
              </figure>
            </Link>
          </div>
        )
          :
          <div className="md:flex-shrink-0 md:w-[45%] lg:w-[28%] xl:w-[45%] mt-4 md:mt-2 max-h-[250px] md:max-h-auto overflow-hidden">
            <Link href={`/blogs/${data.id}`}>
              <p className="bg-gray-300 dark:bg-gray-600 transition-opacity hover:opacity-80 h-[200px] md:h-[150px] w-auto flex items-center justify-center text-gray-400 text-3xl font-bold" >No Image</p>
            </Link>
          </div>
        }
      </div>
    </div>
  )
}

export default ArticleCard