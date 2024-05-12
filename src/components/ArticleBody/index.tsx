import RichEditor from "@/components/ArticleBody/RichEditor";
import ThumbnailCard from '@/components/ArticleBody/ThumbnailCard';
import Chip from '@/components/UiParts/Chip';
import BottomCard from '@/components/ArticleBody/BottomCard';
import FixedButton from '@/components/UiParts/FixedButton';
import { BlogsContentType } from '@/types/microcms';
import HTMLArea from '@/components/ArticleBody/RichEditor/HTMLArea';

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
        <time dateTime='' className="text-gray-400">{data.publishedAt || data.updatedAt}</time>
      </div>
      <ul className='mt-4 flex gap-2'>
        {data.category.map(({ name }, index) => (
          <li key={index}>
            <Chip label={name} />
          </li>
        ))}
      </ul>
      <div className='my-12'>
        {data.body.map((body, index) => {
          switch (body.fieldId) {
            case "richEditor":
              return <RichEditor html={body.richEditor} />
            case "html":
              return <HTMLArea html={body.html} />
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