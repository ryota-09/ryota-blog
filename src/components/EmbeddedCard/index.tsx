import ExternalLink from "@/components/UiParts/ExternalLink";
import { pickHostname } from "@/lib";

type EmbeddedCardProps = {
  /**
   * 遷移先URL
   */
  url: string;
  /**
   * ページタイトル
   */
  title: string;
  /**
   * ページのdescription
   */
  description?: string;
  /**
   * サイトのURL
   */
  website: string;
  /**
   * サイトのバナー画像URL
   */
  banner?: string;
}

const EmbeddedCard = ({ url, title, description, website, banner }: EmbeddedCardProps) => {
  return (
    <ExternalLink href={url} className='cursor-pointer transition-opacity hover:opacity-70 dark:hover:opacity-80'>
      <aside className='flex border bg-white dark:border-gray-600 dark:bg-[#333]'>
        <div className=' max-w-[66%] flex-1 my-1 md:my-4 px-2 md:px-6'>
          <p className='dark:text-gray-300 text-md md:text-xl line-clamp-1'>{title}</p>
          <p className='text-gray-500 text-sm md:mt-4 line-clamp-1'>{description}</p>
          <p className='mt-2 md:mt-6 bg-gray-100 inline-block px-2 rounded-full text-sm md:text-md text-gray-600 line-clamp-1'>{pickHostname(website)}</p>
        </div>
        <figure className="w-auto max-w-[33%] h-[88px] sm:h-[105px] md:h-[130px] lg:h-[160px] flex items-center overflow-hidden">
          {/* NOTE: next/imageだと許可されたドメインしか表示できないため */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={banner} alt={title} loading="lazy" style={{ objectFit: "cover" }} />
        </figure>
      </aside>
    </ExternalLink>
  )
}
export default EmbeddedCard;