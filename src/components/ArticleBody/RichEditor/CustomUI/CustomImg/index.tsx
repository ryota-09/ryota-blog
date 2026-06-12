import Image from "next/image";
import { type ComponentProps } from "react";

type CustomImgProps = { src: string, alt: string, width: string, height: string } & Omit<ComponentProps<"img">, "src" | "alt" | "width" | "height">

const CustomImg = ({ src, alt, width, height, ...restProps }: CustomImgProps) => {
  // NOTE: next/image はGif画像に対して、最適化が効かない
  const isGif = src.endsWith(".gif");
  return (
    <p className="flex justify-center my-8">
      {/* NOTE: モバイルで横幅をはみ出さないよう max-w-full / h-auto を付与（md以上は70%幅） */}
      <Image src={src} alt={alt} width={+width} height={+height} unoptimized={isGif} loading="lazy" className="max-w-full h-auto md:w-[70%]"  {...restProps} />
    </p>
  )
}
export default CustomImg;