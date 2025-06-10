import Image from "next/image";

import RichEditor from "@/components/ArticleBody/RichEditor";
import ThumbnailCard from '@/components/ArticleBody/ThumbnailCard';
import Chip from '@/components/UiParts/Chip';
import BottomCard from '@/components/ArticleBody/BottomCard';
import FixedButton from '@/components/UiParts/FixedButton';
import { BlogsContentType } from '@/types/microcms';
import { Link } from 'next-view-transitions';
import { generateTOCAssets, getPrimaryCategoryId } from "@/lib";
import TOCList from "@/components/ArticleBody/TOCList";
import AdRevenueLabel from "@/components/AdRevenueLabel";
import XShareButton from "@/components/UiParts/XShareButton";
import { baseURL } from "@/config";
import PrevAndNextBlogNav from "@/components/ArticleBody/PrevAndNextBlogNav";
import IssueButton from "@/components/UiParts/IssueButton";
import { calcDiffYears } from "@/util";
import InfoYearsCard from "@/components/UiParts/InfoYearsCard";
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
          <li key={index} className="block cursor-pointer">
            <Link href={`/blogs?category=${name}`}>
              <Chip label={`#${name}`} classes="bg-gray-200 dark:bg-gray-600 dark:text-gray-300 px-3 py-2 text-sm text-txt-base hover:opacity-60" />
            </Link>
          </li>
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
        <IssueButton currentPath={`${baseURL}/blogs/${categoryId}/${data.id}`} />
        <PrevAndNextBlogNav currentBlogData={data} />
        <aside className='flex flex-col-reverse md:flex-row gap-8 md:gap-4 mx-0.5 border-t dark:border-t-[#333] py-10'>
          <BottomCard />
        </aside>
        <FixedButton />
        <XShareButton
          classes="fixed z-50 bottom-4 bottom-4 left-4 bg-gray-400 dark:bg-gray-600 text-white text-sm w-auto h-10 px-2 flex items-center justify-center rounded-lg shadow-lg transition-opacity duration-300 hover:bg-opacity-70 active:bg-gray-500"
          url={`${baseURL}/blogs/${categoryId}/${data.id}`}
        >
          Post to X
        </XShareButton>
      </div>
    </div>
  )
}
export default ArticleBody;