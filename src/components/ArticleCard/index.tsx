import Image from "next/image"

type ArticleCardProps = {
  data: any
}

const ArticleCard = ({ data }: ArticleCardProps) => {
  return (
    <li className="mb-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden py-6 px-6">
        <div className="md:flex gap-4">
          <div className="w-[70%] flex flex-col justify-between">
            <div>
              <a href="#" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">{data.title}</a>
              <p className="mt-2 text-gray-500">{data.description}</p>
            </div>
            <div className="flex justify-end">
              <button className="mt-4 bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
                続きを読む
              </button>
            </div>
          </div>
          <div className="md:flex-shrink-0 w-[28%] relative">
            <Image  src={data.thumbnail} alt={data.title} fill objectFit="cover"/>
          </div>
        </div>
      </div>
    </li>
  )
}

export default ArticleCard