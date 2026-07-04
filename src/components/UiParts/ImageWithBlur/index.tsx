import ImageWithSkeleton from "@/components/UiParts/ImageWithSkeleton"

import type { ImageProps } from "next/image"

type ImageWithBlurProps = {
  src: string
  className?: string
  /**
   * ImageWithSkeleton の wrapperClassName にそのまま転送される。
   * ImageWithBlur は（ImageWithSkeleton を直接使う場合と異なり）呼び出し元が
   * position: relative なコンテナを用意している前提を置かないため、常に
   * ラッパー span を生成する（wrapperClassName を省略した場合は空文字列扱い）。
   */
  wrapperClassName?: string
  /**
   * ImageWithSkeleton の skeletonClassName にそのまま転送される。
   * 円形（rounded-full）画像などスケルトンの見た目を画像に合わせたい場合に指定する。
   */
  skeletonClassName?: string
} & Omit<ImageProps, 'placeholder' | 'blurDataURL' | "src">

// Cloudflare Workersランタイムではfs/sharpが使用不可のため、blurプレースホルダーを省略
// 読み込み完了までは ImageWithSkeleton によるスケルトン表示に委譲する
const ImageWithBlur = ({ className = "", src, alt, wrapperClassName = "", skeletonClassName, ...restProps }: ImageWithBlurProps) => {
  return (
    <ImageWithSkeleton
      {...restProps}
      className={className}
      wrapperClassName={wrapperClassName}
      skeletonClassName={skeletonClassName}
      src={src}
      alt={alt}
      placeholder="empty"
    />
  )
}
export default ImageWithBlur