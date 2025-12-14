"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";
import { useLocale, useTranslations } from "next-intl";

import { BlogsContentType } from "@/types/microcms";
import NewLabel from "@/components/UiParts/NewLabel";
import { isWithinTwoWeeks } from "@/util";
import { getPrimaryCategoryId } from "@/lib";
import { getBlogPath } from "@/lib/i18n-utils";
import Image from "next/image";

type ArticleCardProps = {
  /**
   * ブログ記事のデータ
   */
  data: BlogsContentType;
  /**
   * インデックス
   */
  index: number;
};

const ArticleCard = ({ data, index }: ArticleCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const locale = useLocale();
  const t = useTranslations("blog");
  const categoryId = getPrimaryCategoryId(data);
  const blogPath = getBlogPath(locale, categoryId, data.id);

  // LCP最適化: モバイル（1列）は最初の1枚、デスクトップ（2列）は最初の2枚がLCP候補
  // SSR時に正しい値を出力する必要があるため、両方をカバーするindex <= 1を使用
  const isLcpCandidate = index <= 1;

  return (
    <div className="relative flex h-[540px] flex-col border-2 border-gray-200 bg-white p-6 dark:dark:border-gray-600 dark:bg-black md:h-[290px]">
      {isWithinTwoWeeks(data.publishedAt || data.updatedAt) && (
        <NewLabel className="absolute -left-2 -top-2.5 md:-left-4" />
      )}
      <Link
        href={blogPath}
        className="line-clamp-3 block h-[6rem] text-lg font-medium leading-tight text-black transition duration-200 hover:text-base-color dark:text-gray-300 dark:hover:text-primary sm:line-clamp-2 md:h-[5rem] md:text-xl lg:h-[4.5rem]"
        data-testid={`pw-card-title-${index}`}
      >
        {data.title}
      </Link>
      <div className="flex h-full flex-col-reverse gap-4 overflow-hidden md:flex-row">
        <div className="flex flex-col justify-between md:w-[70%]">
          <p className="mt-2 line-clamp-4 h-[6rem] text-gray-500 sm:line-clamp-3 sm:h-auto md:line-clamp-4">
            {data.description}
          </p>
          <div className="flex justify-end">
            <Link
              href={blogPath}
              className="text-md md:text-md mt-4 border-2 border-base-color px-6 py-3 font-bold text-base-color transition duration-200 hover:border-secondary hover:bg-secondary hover:text-white dark:border-primary dark:text-light dark:hover:border-primary dark:hover:bg-primary md:px-4 md:py-2 md:text-xs"
            >
              {/* NOTE: アクセシビリティの都合上、「続きを読む」は不適切判定なのでsr-onlyを付与 */}
              <span className="sr-only">{data.title}の</span>
              {t("readMore")}
            </Link>
          </div>
        </div>
        {data.thumbnail ? (
          <div className="md:max-h-auto mt-4 flex h-full max-h-[350px] min-h-[220px] flex-col items-center justify-center overflow-hidden sm:max-h-[300px] md:mt-2 md:min-h-[140px] md:w-[45%] md:flex-shrink-0 lg:w-[28%] xl:w-[45%]">
            <Link
              href={blogPath}
              className="flex h-full w-full flex-grow items-center justify-center"
            >
              <figure className="relative w-full transition-opacity hover:opacity-80">
                {/* スケルトン: LCP候補以外の画像のみ表示（LCP候補はフェードインをスキップ） */}
                {!isLcpCandidate && !isImageLoaded && (
                  <div
                    className="absolute inset-0 -z-10 animate-pulse bg-gray-200 dark:bg-gray-600"
                    aria-hidden="true"
                  />
                )}
                <Image
                  src={data.thumbnail.url}
                  alt={data.title}
                  width={data.thumbnail.width}
                  height={data.thumbnail.height}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 45vw, (max-width: 1280px) 28vw, 496px"
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                  className={
                    // LCP候補は常にopacity-100（フェードインによるRender delay回避）
                    isLcpCandidate
                      ? "opacity-100"
                      : !isImageLoaded
                        ? "opacity-0 transition-opacity duration-500"
                        : "opacity-100"
                  }
                  onLoad={() => setIsImageLoaded(true)}
                  loading={isLcpCandidate ? "eager" : "lazy"}
                  fetchPriority={isLcpCandidate ? "high" : "auto"}
                />
              </figure>
            </Link>
          </div>
        ) : (
          <div className="md:max-h-auto mt-4 flex h-full max-h-[350px] min-h-[220px] flex-col items-center overflow-hidden sm:max-h-[300px] md:mt-2 md:min-h-[140px] md:w-[45%] md:flex-shrink-0 lg:w-[28%] xl:w-[45%]">
            <Link
              href={blogPath}
              className="flex h-full w-full flex-grow items-center justify-center bg-gray-300 transition-opacity hover:opacity-80 dark:bg-gray-600"
            >
              <p className="w-auto text-3xl font-bold text-gray-400">
                No Image
              </p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
