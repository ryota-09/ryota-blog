import ImageWithLoader from "@/components/UiParts/ImageWithLoader"
import { BlogsContentType } from "@/types/microcms"
import Link from "next/link"

type ArticleCardProps = {
  data: BlogsContentType
}

const ArticleCard = ({ data }: ArticleCardProps) => {
  return (
    <div className="bg-white border-2 border-gray-200 overflow-hidden p-6 h-full flex flex-col">
      <Link href={`/blogs/${data.id}`} className="block text-lg md:text-xl leading-tight font-medium transition duration-200 text-black hover:text-base-color">{data.title}</Link>
      <div className="flex gap-4 h-full">
        <div className="w-[70%] flex flex-col justify-between">
          <p className="mt-2 text-gray-500">{data.description}</p>
          <div className="flex justify-end">
            <Link href={`/blogs/${data.id}`} className="mt-4 text-xs md:text-md border-2 transition duration-200 border-base-color text-base-color hover:bg-secondary hover:text-white hover:border-secondary font-bold py-2 px-2 md:px-4">
              続きを読む
            </Link>
          </div>
        </div>
        {data.thumbnail && (
          <div className="md:flex-shrink-0 w-[45%] lg:w-[28%] xl:w-[45%] mt-2 flex items-center relative">
            <Link href={`/blogs/${data.id}`}>
              <figure className="overflow-hidden transition-opacity hover:opacity-80">
                <ImageWithLoader src={data.thumbnail.url} alt={data.title} sizes="100%" fill style={{ objectFit: "cover" }} priority />
              </figure>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticleCard