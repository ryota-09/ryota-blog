import { BlogsContentType } from "@/types/microcms"
import Image from "next/image"
import Link from "next/link"

type ArticleCardProps = {
  data: BlogsContentType
}

const ArticleCard = ({ data }: ArticleCardProps) => {
  return (
    <div className="bg-white border-2 border-gray-200 overflow-hidden px-6 pt-6 pb-12 h-full">
      <Link href={`/blogs/${data.id}`} className="block text-xl leading-tight font-medium transition duration-200 text-black hover:text-base-color">{data.title}</Link>
      <div className="md:flex gap-4 h-full">
        <div className="w-[70%] flex flex-col justify-between">
          <div>
            <p className="mt-2 text-gray-500">{data.description}</p>
          </div>
          <div className="flex justify-end">
            <Link href={`/blogs/${data.id}`} className="mt-4 border-2 transition duration-200 border-base-color text-base-color hover:bg-secondary hover:text-white hover:border-secondary font-bold py-2 px-4">
              続きを読む
            </Link>
          </div>
        </div>
        {data.thumbnail && (
          <div className="md:flex-shrink-0 w-[28%] relative">
            <Link href={`/blogs/${data.id}`}>
              <Image src={data.thumbnail.url} alt={data.title} fill objectFit="cover" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticleCard