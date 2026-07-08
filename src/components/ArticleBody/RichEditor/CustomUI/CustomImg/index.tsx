import ImageWithSkeleton from "@/components/UiParts/ImageWithSkeleton";
import { type ComponentProps } from "react";

type CustomImgProps = { src: string, alt: string, width: string, height: string } & Omit<ComponentProps<"img">, "src" | "alt" | "width" | "height">

const CustomImg = ({ src, alt, width, height, ...restProps }: CustomImgProps) => {
  // NOTE: next/image はGif画像に対して、最適化が効かない
  const isGif = src.endsWith(".gif");
  return (
    <p className="flex justify-center my-8">
      {/*
        NOTE: サイズ指定クラス（モバイルで横幅をはみ出さない max-w-full / md以上は70%幅）は
        ラッパー側（wrapperClassName）に持たせる。flex中央寄せの親の直下にパーセンテージ幅を
        持つ画像を直接置くと、スケルトン用ラッパーの shrink-to-fit と幅解決が循環してしまうため、
        70%幅の解決を wrapper の1階層に固定し、画像自体は wrapper を w-full で埋めるだけにする。

        NOTE: {...restProps} は明示指定のprops（src/alt/width/height/className等）より
        必ず前に展開すること。custom HTML area機能でCMS本文の<img>にclass属性が付与されていた場合、
        html-react-parserがそれをclassName propに変換してrestPropsに含めるため、後ろに置くと
        意図したclassName="h-auto w-full"（横はみ出し防止の要）が上書きされてしまう。
      */}
      <ImageWithSkeleton
        {...restProps}
        src={src}
        alt={alt}
        width={+width}
        height={+height}
        unoptimized={isGif}
        loading="lazy"
        // 実表示幅はmd以上で本文コンテナ(≈994px)の70%≈700pxが上限。
        // sizes未指定(=100vw扱い)だと表示サイズの1.2〜2.4倍のバリアントを取得してしまうため明示する
        sizes="(min-width: 768px) 700px, 100vw"
        wrapperClassName="max-w-full md:w-[70%]"
        className="h-auto w-full"
      />
    </p>
  )
}
export default CustomImg;