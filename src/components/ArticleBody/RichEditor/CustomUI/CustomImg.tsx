import ImageWithLoader from "@/components/UiParts/ImageWithLoader";
import { type ComponentProps } from "react";

type CustomImgProps = { src: string, alt: string, width: string, height: string } & Omit<ComponentProps<"img">, "src" | "alt" | "width" | "height">

const CustomImg = ({ src, alt, width, height, ...restProps }: CustomImgProps) => {
  return (
    <p className="flex justify-center my-8">
      <ImageWithLoader src={src} alt={alt} width={+width} height={+height} classes="w-[70%]" {...restProps} />
    </p>
  )
}
export default CustomImg;