import RichEditor from "@/components/ArticleBody/RichEditor";
import ThumbnailCard from '@/components/ArticleBody/ThumbnailCard';
import Chip from '@/components/UiParts/Chip';
import BottomCard from '@/components/ArticleBody/BottomCard';
import FixedButton from '@/components/UiParts/FixedButton';
import { BlogsContentType } from '@/types/microcms';
import HTMLArea from '@/components/ArticleBody/RichEditor/HTMLArea';
import { Link } from 'next-view-transitions';
import { generateTOCAssets } from "@/lib";
import TOCList from "@/components/ArticleBody/TOCList";
import AdRevenueLabel from "@/components/AdRevenueLabel";
import ImageWithLoader from "@/components/UiParts/ImageWithLoader";
import XShareButton from "@/components/UiParts/XShareButton";
import { baseURL } from "@/config";

type ArticleBodyProps = {
  data: BlogsContentType
}

const ArticleBody = ({ data }: ArticleBodyProps) => {
  const joindedHTML = data.body.map((body) => {
    if (body.fieldId === 'richEditor') {
      return body.richEditor
    }
  }).join('')

  const TOCdata = generateTOCAssets(joindedHTML)

  return (
    <div>
      <div className='md:w-[80%] mx-auto my-4 md:my-16'>
        {data.thumbnail
          ?
          <div className="flex flex-col gap-8">
            <h1 className="text-2xl md:text-3xl font-bold">{data.title}</h1>
            <figure className=" max-h-[300px] md:max-h-[540px] overflow-hidden shadow-2xl">
              <ImageWithLoader
                src={data.thumbnail.url}
                alt={data.title}
                width={data.thumbnail.width}
                height={data.thumbnail.height}
                priority
              />
            </figure>
          </div>
          :
          <ThumbnailCard title={data.title} />
        }
      </div>
      <div className='mt-4'>
        <time dateTime={data.updatedAt.split('T')[0]} className="text-gray-400">{data.updatedAt.split('T')[0].replaceAll("-", "/")}</time>
      </div>
      <ul className='mt-4 flex gap-2'>
        {data.category.map(({ name }, index) => (
          <Link href={`/blogs?category=${name}`} key={index}>
            <li className="block cursor-pointer">
              <Chip label={name} classes="bg-gray-200 px-3 py-2 text-sm text-txt-base hover:opacity-60" />
            </li>
          </Link>
        ))}
      </ul>
      <div className="mt-4">
        <TOCList data={TOCdata} />
      </div>
      {data.isAdvertisement && (
        <aside className="mt-4">
          <AdRevenueLabel />
        </aside>
      )}
      <div className='my-12'>
        {data.body.map((body, index) => {
          switch (body.fieldId) {
            case "richEditor":
              return <RichEditor key={index} html={body.richEditor} />
            case "html":
              return <HTMLArea key={index} html={body.html} />
          }
        })}
        <aside className='flex gap-4 mx-0.5 border-t py-10'>
          <BottomCard />
        </aside>
        <FixedButton />
        <XShareButton
          classes="fixed top-4 right-4 bg-gray-400 text-white text-sm w-auto h-10 px-2 flex items-center justify-center rounded-lg shadow-lg transition-opacity duration-300 hover:bg-opacity-70 active:bg-gray-500"
          text={data.title}
          url={`${baseURL}/blogs/${data.id}`}
        >
          Post to X
        </XShareButton>
      </div>
    </div>
  )
}
export default ArticleBody;