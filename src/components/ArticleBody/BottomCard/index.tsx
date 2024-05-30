import ImageWithLoader from "@/components/UiParts/ImageWithLoader";
import { AUTHOR_DESCRIPTION, AUTHOR_NAME } from "@/static/blogs";

const BottomCard = () => {
  return (
    <>
      <div className='flex items-center justify-center shrink-0 mx-6'>
        <ImageWithLoader src="/author.jpg" alt="author" width={80} height={80} classes="rounded-full" />
      </div>
      <div>
        <p className='font-bold text-3xl dark:text-gray-300'>{AUTHOR_NAME}</p>
        <p className="mx-1 mt-4 text-gray-500 dark:text-gray-400">{AUTHOR_DESCRIPTION}</p>
      </div>
    </>
  )
}
export default BottomCard;