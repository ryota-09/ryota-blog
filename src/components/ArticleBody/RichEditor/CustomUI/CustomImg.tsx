import Image from "next/image";
import { HTMLAttributes } from "react";

type CustomImgProps = { src: string, alt: string, width: string, height: string } & HTMLAttributes<HTMLImageElement>

const CustomImg = ({ src, alt, width, height, ...restProps }: CustomImgProps) => {
  return (
    <p className="flex justify-center my-8">
      <Image {...restProps} src={src} alt={alt} width={+width} height={+height} className="w-[70%]" />
    </p>
  )
}
export default CustomImg;