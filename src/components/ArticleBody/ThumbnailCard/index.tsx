import { AUTHOR_NAME } from "@/static/blogs";
import Image from "next/image";

type ThumbnailCardProps = {
  title: string;
}

const ThumbnailCard = ({ title }: ThumbnailCardProps) => {
  return (
    <div className='border-[32px] rounded-3xl border-secondary flex flex-col justify-between'>
      <h1 className="text-3xl font-bold my-16 mx-4">{title}</h1>
      <div className='flex justify-end items-center gap-4 m-6'>
        <Image src="/author.jpg" alt="author" width={80} height={80} className="rounded-full" objectFit='cover' />
        <p className='font-bold text-3xl'>{AUTHOR_NAME}</p>
      </div>
    </div>
  )
}
export default ThumbnailCard;