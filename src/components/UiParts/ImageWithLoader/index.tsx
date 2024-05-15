"use client"

import { microCMSLoader } from "@/lib";
import { cltw } from "@/util";
import type { ImageProps } from "next/image";
import Image from "next/image";

type ImageWithLoaderProps = ImageProps & {
  classes?: string;
}

const ImageWithLoader = ({ src, alt, width, height, classes = "", ...restProps }: ImageWithLoaderProps) => {
  return <Image src={src} alt={alt} width={width} height={height} className={cltw(classes)} loader={microCMSLoader} {...restProps} />
}
export default ImageWithLoader;