import Image from "next/image"
import { getPlaiceholder } from 'plaiceholder'
import fs from "node:fs/promises";

import type { ImageProps } from "next/image"


type ImageWithBlurProps = {
  src: string
  className?: string
} & Omit<ImageProps, 'placeholder' | 'blurDataURL' | "src">

const ImageWithBlur = async ({ className = "", src, alt, ...restPros }: ImageWithBlurProps) => {
  const isInternal = !src.startsWith("http") || !src.startsWith("https")
  // NOTE: 画像が内部リソースの場合は、fs.readFileで読み込む
  if (isInternal) {
    const buffer = await fs.readFile(`./public${src}`)
    const { base64 } = await getPlaiceholder(buffer)
    return (
      <Image {...restPros} className={className} src={src} alt={alt} placeholder="blur" blurDataURL={base64} />
    )
  }

  const arrayBuffer = await fetch(src).then((res) => res.arrayBuffer())
  const buffer = Buffer.from(arrayBuffer)
  const { base64 } = await getPlaiceholder(buffer)
  return (
    <Image {...restPros} className={className} src={src} alt={alt} placeholder="blur" blurDataURL={base64} />
  )
}
export default ImageWithBlur