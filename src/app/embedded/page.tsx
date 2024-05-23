import metaFetcher from 'meta-fetcher';
import { unstable_cache } from 'next/cache';
import EmbeddedCard from '@/components/EmbeddedCard';

const Page = async ({ searchParams }: { searchParams: { url: string } }) => {
  const url = searchParams.url
  const metadata = await unstable_cache((url: string) => metaFetcher(url), [url], { revalidate: 24 * 60 * 60 })(url)

  return (
    <main className='w-full h-full'>
      <EmbeddedCard
        url={url}
        title={metadata.metadata.title}
        description={metadata.metadata.description}
        website={metadata.metadata.website}
        banner={metadata.metadata.banner}
      />
    </main >
  );
}
export default Page