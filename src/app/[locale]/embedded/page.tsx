import metaFetcher from 'meta-fetcher';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import EmbeddedCard from '@/components/EmbeddedCard';

// SSRF対策: https のみ許可し、内部/プライベート宛先を拒否する
const isSafeEmbedUrl = (rawUrl: string): boolean => {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }

  if (parsed.protocol !== 'https:') return false;

  const host = parsed.hostname.toLowerCase();

  // localhost / 内部ドメイン
  if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal')) {
    return false;
  }

  // クラウドメタデータ・ループバック・リンクローカル・プライベートIP帯を拒否
  const privateIpPatterns = [
    /^127\./,
    /^10\./,
    /^192\.168\./,
    /^169\.254\./, // リンクローカル（169.254.169.254 等のメタデータ含む）
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^0\./,
  ];
  if (privateIpPatterns.some((re) => re.test(host))) return false;

  // IPv6 ループバック / ユニークローカル
  if (host === '::1' || host.startsWith('fc') || host.startsWith('fd') || host.startsWith('[')) {
    return false;
  }

  return true;
};

const Page = async ({ searchParams }: { searchParams: Promise<{ url: string }> }) => {
  // Next.js 16では、searchParamsを非同期で取得する必要がある
  const { url } = await searchParams;

  if (!url || !isSafeEmbedUrl(url)) {
    notFound();
  }

  let metadata;
  try {
    metadata = await unstable_cache((u: string) => metaFetcher(u), [url], { revalidate: 24 * 60 * 60 })(url);
  } catch {
    notFound();
  }

  if (!metadata?.metadata) {
    notFound();
  }

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
