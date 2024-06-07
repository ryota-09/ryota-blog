import SocialMediaNav from "@/components/Header/SocialMediaNav"
import Chip from "@/components/UiParts/Chip"
import { AUTHOR_DESCRIPTION, AUTHOR_NAME } from "@/static/blogs"
import Image from "next/image"

const Page = () => {
  return (
    <article className="flex-grow flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 w-full min-h-[600px] bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-600 h-full px-8">
      <div className="flex flex-col items-start space-y-8">
        <Chip label={"Software Engineer"} classes="bg-light dark:bg-primary py-1 px-3 text-txt-base" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl dark:text-gray-300">{AUTHOR_NAME}</h1>
        <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          {AUTHOR_DESCRIPTION}
        </p>
        <SocialMediaNav />
      </div>
      <figure>
        <Image src="/author.jpg" alt={AUTHOR_NAME} className="block shadow-2xl mx-auto aspect-square overflow-hidden rounded-full object-cover w-[200px] md:w-[400px]" width={400} height={400} />
      </figure>
    </article>
  )
}
export default Page