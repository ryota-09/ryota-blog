import ImageWithLoader from "@/components/UiParts/ImageWithLoader"
import { BlogsContentType } from "@/types/microcms"
import { Link } from 'next-view-transitions'

const MAX_DESCRIPTION_LENGTH = 50

type ArticleCardProps = {
  data: BlogsContentType
}

const ArticleCard = ({ data }: ArticleCardProps) => {
  return (
    <div className="bg-white border-2 border-gray-200 overflow-hidden p-6 h-full flex flex-col">
      <Link href={`/blogs/${data.id}`} className="block text-lg md:text-xl leading-tight font-medium transition duration-200 text-black hover:text-base-color">{data.title}</Link>
      <div className="flex gap-4 h-full flex-col-reverse md:flex-row">
        <div className="md:w-[70%] flex flex-col justify-between">
          <p className="mt-2 text-gray-500">{data.description.length < MAX_DESCRIPTION_LENGTH ? data.description : data.description.slice(0,MAX_DESCRIPTION_LENGTH) + "..."}</p>
          <div className="flex justify-end">
            <Link href={`/blogs/${data.id}`} className="mt-4 text-xs md:text-md border-2 transition duration-200 border-base-color text-base-color hover:bg-secondary hover:text-white hover:border-secondary font-bold py-2 px-2 md:px-4">
              続きを読む
            </Link>
          </div>
        </div>
        {data.thumbnail && (
          <div className="md:flex-shrink-0 md:w-[45%] lg:w-[28%] xl:w-[45%] mt-4 md:mt-2 max-h-[250px] md:max-h-auto overflow-hidden flex items-center relative">
            <Link href={`/blogs/${data.id}`}>
              <figure className="transition-opacity hover:opacity-80">
                <ImageWithLoader src={data.thumbnail.url} alt={data.title} width={data.thumbnail.width} height={data.thumbnail.height} priority />
              </figure>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticleCard