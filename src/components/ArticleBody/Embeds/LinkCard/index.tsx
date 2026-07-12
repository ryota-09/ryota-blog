import ExternalLink from "@/components/UiParts/ExternalLink";
import { pickHostname } from "@/lib";

import ogpCache from "../../../../../content/ogp-cache.json";

type LinkCardProps = {
  url: string;
};

type OgpCacheEntry = {
  url: string;
  title: string;
  description: string | null;
  image: string | null;
  favicon: string | null;
  hostname: string;
  ok: boolean;
};

const OGP_CACHE = ogpCache as Record<string, OgpCacheEntry>;

// ビルド時に静的化したOGPキャッシュ(content/ogp-cache.json、scripts/fetch-ogp-cache.mjsで生成)を
// 参照してリンクカードを描画する。旧実装(iframely+`/[locale]/embedded` iframe)と異なり
// 実行時fetchを行わないため、Cloudflare Workers(fsなし)でもビルド時に完結する。
// キャッシュに無いURLは素の外部リンクカード(タイトル=URL)にフォールバックする。
const LinkCard = ({ url }: LinkCardProps) => {
  const cached = OGP_CACHE[url];
  const title = cached?.title ?? url;
  const description = cached?.description ?? undefined;
  const image = cached?.image ?? undefined;
  const hostname = cached?.hostname ?? pickHostname(url);

  return (
    <ExternalLink
      href={url}
      className="cursor-pointer transition-opacity hover:opacity-70 dark:hover:opacity-80 block my-4"
    >
      <aside className="flex w-full h-[90px] sm:h-[106px] md:h-[128px] lg:h-[174px] border bg-white dark:border-gray-600 dark:bg-[#333] overflow-hidden">
        <div className="max-w-[66%] flex-1 my-1 md:my-4 px-2 md:px-6 flex flex-col justify-center">
          <p className="dark:text-gray-300 text-md md:text-xl line-clamp-1">{title}</p>
          {description && (
            <p className="text-gray-500 dark:text-gray-400 text-sm md:mt-4 line-clamp-1 h-5">{description}</p>
          )}
          <p className="mt-2 md:mt-6 bg-gray-100 inline-block px-2 rounded-full text-sm md:text-md text-gray-600 line-clamp-1 w-fit">
            {hostname}
          </p>
        </div>
        {image && (
          // CLS対策: w-autoだと画像ロード完了時に幅0→実サイズへ変化しテキスト列が動くため、
          // 幅を固定してロード前後でレイアウトが変わらないようにする(はみ出しはobject-coverで吸収)
          <figure className="w-[33%] flex items-center overflow-hidden shrink-0">
            {/* NOTE: next/imageだと許可されたドメインしか表示できないため(EmbeddedCardと同じ理由) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover" />
          </figure>
        )}
      </aside>
    </ExternalLink>
  );
};

export default LinkCard;
