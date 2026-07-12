import ExternalLink from "@/components/UiParts/ExternalLink";

type AmazonLinkProps = {
  href: string;
  image: string;
  title: string;
  trackingImage?: string;
};

// 現行 AmazonLinkCard(RichEditor/AmazonLinkCard + amazonLinkCardOptions)のスタイルを踏襲し、
// html-react-parserを使わずprops(href/image/title/trackingImage)から直接描画する。
// trackingImageは1x1のトラッキングピクセルとしてそのまま描画する(もしもアフィリエイトの計測用)。
const AmazonLink = ({ href, image, title, trackingImage }: AmazonLinkProps) => {
  return (
    <aside className="w-full my-10">
      <ExternalLink
        href={href}
        className="relative flex flex-col md:flex-row items-center gap-8 px-4 py-8 md:px-6 md:py-4 border-[#D0AD77] border-[6px] hover:transition hover:opacity-80 hover:text-[#D0AD77] after:content-['Amazon'] after:text-gray-700 after:bg-[#D0AD77] after:absolute after:py-0 lg:after:py-2 md:after:py-0.5 after:px-4 after:w-auto after:top-0 after:right-0"
      >
        {/* CLS対策: 商品画像はすべてAmazonの_SL160_サムネイル(長辺160px)のため、
            図版領域を160pxで固定予約し、画像ロード完了時のレイアウト変化を防ぐ */}
        <figure className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={title} loading="lazy" className="max-h-full max-w-full object-contain" />
        </figure>
        <br />
        {title}
      </ExternalLink>
      {trackingImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={trackingImage} width={1} height={1} alt="" style={{ display: "none" }} />
      )}
    </aside>
  );
};

export default AmazonLink;
