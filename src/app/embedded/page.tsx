import ExternalLink from '@/components/UiParts/ExternalLink';
import ImageWithLoader from '@/components/UiParts/ImageWithLoader';
import { pickHostname } from '@/lib';
import metaFetcher from 'meta-fetcher';

const MAX_DESCRIPTION_LENGTH = 50

const Page = async ({ searchParams }: { searchParams: { url: string } }) => {
  const url = searchParams.url
  const metadata = await metaFetcher(url)
  return (
    <main className='w-full h-full  border-2 bg-white'>
      <ExternalLink href={url} className=' cursor-pointer transition-opacity hover:opacity-70'>
        <aside className='flex'>
          <div className='flex-1 my-1 md:my-4 px-2 md:px-6'>
            <p className='text-md md:text-xl'>{metadata.metadata.title}</p>
            <p className='text-gray-400 text-sm md:mt-4 line-clamp-1 sm:line-clamp-3'>{metadata.metadata.description}</p>
            {/* https:// もしくは http:// を除く */}
            <p className='mt-2 md:mt-4 bg-gray-100 inline-block px-2 rounded-full text-sm md:text-md text-gray-600'>{pickHostname(metadata.metadata.website)}</p>
          </div>
          <figure className="w-1/3 md:w-auto md:flex-shrink-0">
            <ImageWithLoader src={metadata.metadata.banner ?? ""} alt={metadata.metadata.title} width={300} height={200} />
          </figure>
        </aside>
      </ExternalLink>
    </main >
  );
}
export default Page