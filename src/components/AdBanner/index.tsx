// 広告掲載募集ウィジェットコンポーネント
// PC版: サイドバーのカテゴリ上に配置（縦型カード）
// Mobile版: ヘッダー下に配置（横型バナー）

import Image from "next/image";
import { getTranslations } from "next-intl/server";

const CONTACT_URL =
  "https://docs.google.com/forms/d/1RP2EUWjYvEa2gwFd0bjFurmZxUFCfvxtwxqpm6ggO68/viewform";

type AdBannerProps = {
  variant: "sidebar" | "banner";
};


const AdBanner = async ({ variant }: AdBannerProps) => {
  const t = await getTranslations("adBanner");

  if (variant === "sidebar") {
    // PC版サイドバーウィジェット
    // NOTE: aria-labelは付けない。可視テキストを含まないaria-labelは
    // label-content-name-mismatch(WCAG 2.5.3)違反となり音声入力ユーザーが
    // 見えているテキストで操作できないため、リンク内の可視テキストを
    // そのままaccessible nameにする
    return (
      <a
        href={CONTACT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
        data-gtm-click="ad_banner_cta"
        data-gtm-variant="sidebar"
      >
        <div
          className="rounded-xl overflow-hidden relative h-[290px]
          bg-gradient-to-br from-[#1a5c66] via-primary to-secondary
          shadow-lg hover:shadow-xl transition-all duration-300
          hover:scale-[1.02]"
        >
          {/* 装飾的な背景要素 */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-6 -mb-6" />
          <div className="absolute top-1/2 right-4 w-12 h-12 bg-white/[0.03] rounded-full" />

          <div className="relative p-6 text-white h-full flex flex-col justify-between">
            <div>
              {/* アイコン */}
              <Image src="/icons/megaphone.svg" alt="" width={28} height={28} className="mb-2 opacity-90 brightness-0 invert" />

              {/* ラベル */}
              <div className="text-[10px] font-semibold tracking-[0.2em] uppercase opacity-70 mb-1">
                {t("sponsorLabel")}
              </div>

              {/* タイトル。装飾目的でありドキュメントアウトラインに載せる必要がないため、
                  見出しタグは使わない(一覧ページでh2を飛ばすheading-order違反になる) */}
              <p className="text-xl font-bold leading-tight mb-2">
                {t("sidebarTitle1")}
                <br />
                {t("sidebarTitle2")}
              </p>

              {/* 区切り線 */}
              <div className="w-8 h-0.5 bg-white/30 mb-2" />

              {/* 説明文 */}
              <p className="text-[13px] text-white/75 leading-relaxed">
                {t("sidebarDescription")}
              </p>
            </div>

            {/* CTA */}
            <div
              className="inline-flex items-center gap-1.5 text-sm font-medium
              text-white/90 group-hover:text-white
              border-b border-white/30 group-hover:border-white/60
              pb-0.5 transition-all duration-300 self-start"
            >
              <span>{t("sidebarCta")}</span>
            </div>
          </div>
        </div>
      </a>
    );
  }

  // Mobile版バナー
  // NOTE: sidebar variant同様、可視テキストをそのままaccessible nameにするためaria-labelは付けない
  return (
    <a
      href={CONTACT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
      data-gtm-click="ad_banner_cta"
      data-gtm-variant="banner"
    >
      <div
        className="bg-gradient-to-r from-[#1a5c66] via-primary to-secondary
        px-4 py-3.5 flex items-center justify-between relative overflow-hidden"
      >
        {/* 装飾的な背景要素 */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />

        <div className="flex items-center gap-3 text-white relative">
          <Image src="/icons/megaphone.svg" alt="" width={20} height={20} className="flex-shrink-0 opacity-90 brightness-0 invert" />
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold tracking-wide">
              {t("bannerTitle")}
            </span>
            <span className="text-[11px] text-white/60 hidden min-[400px]:inline">
              {t("bannerSubtitle")}
            </span>
          </div>
        </div>

        <div
          className="relative flex items-center gap-1 text-xs font-medium text-white/80
          group-hover:text-white transition-colors duration-300 flex-shrink-0"
        >
          <span className="hidden min-[360px]:inline">{t("bannerCta")}</span>
        </div>
      </div>
    </a>
  );
};

export default AdBanner;
