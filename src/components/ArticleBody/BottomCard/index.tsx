import { AUTHOR_DESCRIPTION, AUTHOR_NAME } from "@/static/blogs";
import Image from "next/image";

const BottomCard = () => {
  return (
    <>
      <div className='flex items-center shrink-0 mx-6'>
        <Image src="/author.jpg" alt="author" width={80} height={80} className="rounded-full" />
      </div>
      <div>
        <p className='font-bold text-3xl'>{AUTHOR_NAME}</p>
        <p className="mx-1 mt-4 text-gray-500">{AUTHOR_DESCRIPTION}</p>
      </div>
    </>
  )
}
export default BottomCard;