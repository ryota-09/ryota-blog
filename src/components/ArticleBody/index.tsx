import Image from "next/image";

import RichEditor from "@/components/ArticleBody/RichEditor";
import ThumbnailCard from '@/components/ArticleBody/ThumbnailCard';
import BottomCard from '@/components/ArticleBody/BottomCard';
import FixedButton from '@/components/UiParts/FixedButton';
import { BlogsContentType } from '@/types/microcms';
import { generateTOCAssets, getPrimaryCategoryId } from "@/lib";
import TOCList from "@/components/ArticleBody/TOCList";
import AdRevenueLabel from "@/components/AdRevenueLabel";
import PrevAndNextBlogNav from "@/components/ArticleBody/PrevAndNextBlogNav";
import IssueButton from "@/components/UiParts/IssueButton";
import { calcDiffYears } from "@/util";
import InfoYearsCard from "@/components/UiParts/InfoYearsCard";
import CategoryTag from "./CategoryTag";
import LocaleAwareShare from "./LocaleAwareShare";
import dynamic from "next/dynamic";

const HTMLArea = dynamic(() => import('@/components/ArticleBody/RichEditor/HTMLArea'), { ssr: false });
const AmazonLinkCard = dynamic(() => import('@/components/ArticleBody/RichEditor/AmazonLinkCard'), { ssr: false });

type ArticleBodyProps = {
  data: BlogsContentType
}

const ArticleBody = ({ data }: ArticleBodyProps) => {
  const joindedHTML = data.body.map((body) => {
    if (body.fieldId === 'richEditor') {
      return body.richEditor
    }
  }).join('')

  const displayTime = data.publishedAt || data.updatedAt
  const categoryId = getPrimaryCategoryId(data);

  const TOCdata = generateTOCAssets(joindedHTML)
  return (
    <div>
      <div className='md:w-[80%] mx-auto my-6 md:my-16'>
        {data.thumbnail
          ?
          <div className="flex flex-col gap-8">
            <h1 className="text-2xl md:text-3xl font-bold dark:text-gray-300">{data.title}</h1>
            <figure className="max-h-[300px] md:max-h-[540px] overflow-hidden shadow-2xl">
              <Image
                src={data.thumbnail.url}
                alt={data.title}
                width={data.thumbnail.width}
                height={data.thumbnail.height}
                sizes="100vw"
                style={{ height: "auto", width: "100%" }}
                loading="eager"
                priority
              />
            </figure>
          </div>
          :
          <ThumbnailCard title={data.title} />
        }
      </div>
      <div className='mt-4'>
        <time dateTime={displayTime.split('T')[0]} className="text-gray-400">{displayTime.split('T')[0].replaceAll("-", "/")}</time>
      </div>
      {calcDiffYears(displayTime) >= 1 && (
        <aside className="mt-4">
          <InfoYearsCard diffYear={calcDiffYears(displayTime)} />
        </aside>
      )}
      <ul className='mt-4 flex flex-wrap gap-2'>
        {data.category.map(({ name }, index) => (
          <CategoryTag key={index} name={name} index={index} />
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
              const html = body.html
              if (html.startsWith('AMAZON')) {
                return <AmazonLinkCard key={index} html={html.replace("AMAZON", "")} />
              }
              return <HTMLArea key={index} html={html} />
          }
        })}
      </div>
        <IssueButton currentPath={`https://ryotablog.com/ja/blogs/${categoryId}/${data.id}`} />
        <PrevAndNextBlogNav currentBlogData={data} />
        <aside className='flex flex-col-reverse md:flex-row gap-8 md:gap-4 mx-0.5 border-t dark:border-t-[#333] py-10'>
          <BottomCard />
        </aside>
        <FixedButton />
        <LocaleAwareShare categoryId={categoryId} blogId={data.id} title={data.title} />
    </div>
  )
}
export default ArticleBody;