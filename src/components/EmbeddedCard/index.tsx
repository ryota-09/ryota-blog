import ExternalLink from "@/components/UiParts/ExternalLink";
import ImageWithLoader from "@/components/UiParts/ImageWithLoader";
import { pickHostname } from "@/lib";

type EmbeddedCardProps = {
  url: string;
  title: string;
  description?: string;
  website: string;
  banner?: string;
}

const EmbeddedCard = ({ url, title, description, website, banner }: EmbeddedCardProps) => {
  return (
    <ExternalLink href={url} className=' cursor-pointer transition-opacity hover:opacity-70'>
      <aside className='flex border-2'>
        <div className='flex-1 my-1 md:my-4 px-2 md:px-6'>
          <p className='text-md md:text-xl line-clamp-1 sm:line-clamp-2'>{title}</p>
          <p className='text-gray-400 text-sm md:mt-4 line-clamp-1 sm:line-clamp-3'>{description}</p>
          {/* https:// もしくは http:// を除く */}
          <p className='mt-2 md:mt-4 bg-gray-100 inline-block px-2 rounded-full text-sm md:text-md text-gray-600'>{pickHostname(website)}</p>
        </div>
        <figure className="w-1/3 md:w-auto md:flex-shrink-0 flex items-center">
          <ImageWithLoader src={banner ?? ""} alt={title} width={300} height={200} />
        </figure>
      </aside>
    </ExternalLink>
  )
}
export default EmbeddedCard;