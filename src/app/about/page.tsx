import Chip from "@/components/UiParts/Chip"
import ImageWithLoader from "@/components/UiParts/ImageWithLoader"
import { AUTHOR_DESCRIPTION, AUTHOR_NAME } from "@/static/blogs"

const Page = () => {
  return (
    <article className="w-full py-12 md:py-24 lg:py-32 bg-white border-2 border-gray-200 h-full">
      <div className="container grid items-center gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col items-start space-y-8">
          <Chip label={"Software Engineer"} classes="bg-light py-1 px-3 text-txt-base" />
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">{AUTHOR_NAME}</h1>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            {AUTHOR_DESCRIPTION}
          </p>
        </div>
        <ImageWithLoader src="/icon.jpg" alt={AUTHOR_NAME} className="block shadow-2xl mx-auto aspect-square overflow-hidden rounded-full object-cover w-[200px] md:w-[400px]" width={400} height={400} />
      </div>
    </article>
  )
}
export default Page