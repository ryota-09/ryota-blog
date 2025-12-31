"use client";

import Image from "next/image";
import BackToTopLink from "./BackToTopLink";
import { useTranslations } from "next-intl";

type NoContentsProps = {
  /**
   * 戻り先のパス（localeなし）
   */
  returnPath?: string;
  /**
   * ブログタイプ（Zennモード時の色変更用）
   */
  blogType?: "blogs" | "zenn";
}

const NoContents = ({ returnPath = "/blogs", blogType = "blogs" }: NoContentsProps) => {
  const t = useTranslations("error");

  return (
    <div
      className="flex h-full min-h-[2208px] flex-col items-center justify-center border-2 border-gray-200 bg-white px-4 py-4 dark:dark:border-gray-600 dark:bg-black md:min-h-[596px] md:flex-row"
      data-testid="pw-no-content-page"
    >
      <Image
        src="/no_contents.png"
        alt="No contents"
        width={300}
        height={300}
        sizes="100vw"
        style={{ width: "60%", height: "auto" }}
        className="max-h-[500px]"
      />
      <div className="flex flex-col gap-8">
        <p className="text-center dark:text-gray-400 md:text-left">
          {t("noContent.message")}
        </p>
        <div className="flex justify-center md:justify-start">
          <BackToTopLink returnPath={returnPath} blogType={blogType} />
        </div>
      </div>
    </div>
  );
};
export default NoContents;
