"use client"
import ImageWithLoader from "@/components/UiParts/ImageWithLoader";
import { microCMSLoader } from "@/lib";
import { AUTHOR_NAME } from "@/static/blogs";
import Image from "next/image";

type ThumbnailCardProps = {
  title: string;
}

const ThumbnailCard = ({ title }: ThumbnailCardProps) => {
  return (
    <div className='border-[12px] md:w-full md:border-[32px] rounded-3xl border-secondary flex flex-col justify-between'>
      <h1 className="text-xl md:text-3xl font-bold my-16 mx-4 dark:text-gray-300">{title}</h1>
      <div className='flex justify-end items-center gap-4 m-6'>
        <ImageWithLoader src="/author.jpg" alt="author" width={80} height={80} classes="rounded-full w-[50px] md:w-[80px]" />
        <p className='font-bold text-lg md:text-3xl dark:text-gray-300'>{AUTHOR_NAME}</p>
      </div>
    </div>
  )
}
export default ThumbnailCard;