import RichEditor from "@/components/ArticleBody/RichEditor";
import ThumbnailCard from '@/components/ArticleBody/ThumbnailCard';
import Chip from '@/components/UiParts/Chip';
import BottomCard from '@/components/ArticleBody/BottomCard';
import FixedButton from '@/components/UiParts/FixedButton';
import { BlogsContentType } from '@/types/microcms';
import HTMLArea from '@/components/ArticleBody/RichEditor/HTMLArea';
import Link from "next/link";

type ArticleBodyProps = {
  data: BlogsContentType
}

const ArticleBody = ({ data }: ArticleBodyProps) => {
  return (
    <div>
      <div className='w-[80%] mx-auto my-16'>
        <ThumbnailCard title={data.title} />
      </div>
      <div className='mt-4'>
        <time dateTime={data.updatedAt.split('T')[0]} className="text-gray-400">{data.updatedAt.split('T')[0].replaceAll("-", "/")}</time>
      </div>
      <ul className='mt-4 flex gap-2'>
        {data.category.map(({ name }, index) => (
          <Link href={`/blogs?category=${name}`} key={index}>
            <li className="block cursor-pointer">
              <Chip label={name} />
            </li>
          </Link>
        ))}
      </ul>
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
      </div>
    </div>
  )
}
export default ArticleBody;