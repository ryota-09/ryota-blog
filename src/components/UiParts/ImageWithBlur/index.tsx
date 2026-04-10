import Image from "next/image"

import type { ImageProps } from "next/image"

type ImageWithBlurProps = {
  src: string
  className?: string
} & Omit<ImageProps, 'placeholder' | 'blurDataURL' | "src">

// Cloudflare Workersランタイムではfs/sharpが使用不可のため、blurプレースホルダーを省略
const ImageWithBlur = ({ className = "", src, alt, ...restProps }: ImageWithBlurProps) => {
  return (
    <Image
      {...restProps}
      className={className}
      src={src}
      alt={alt}
      placeholder="empty"
    />
  )
}
export default ImageWithBlur