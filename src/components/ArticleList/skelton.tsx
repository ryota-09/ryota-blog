import { PER_PAGE } from "@/static/blogs"

const Skelton = () => {
  return (
    <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {Array.from({ length: PER_PAGE }).map((_, index) => (
        <li key={index}>
          <div className="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-600 overflow-hidden p-6 h-full flex flex-col">
            <div className="block text-lg md:text-xl leading-tight font-medium transition duration-200 bg-gray-200 dark:bg-gray-600 h-6 w-full mb-4 animate-pulse" />
            <div className="flex gap-4 h-full flex-col-reverse md:flex-row">
              <div className="md:w-[70%] flex flex-col justify-between">
                <div>
                  <div className="mt-2 bg-gray-200 dark:bg-gray-600 h-4 w-full animate-pulse" />
                  <div className="mt-2 bg-gray-200 dark:bg-gray-600 h-4 w-full animate-pulse" />
                  <div className="mt-2 bg-gray-200 dark:bg-gray-600 h-4 w-full animate-pulse" />
                </div>
                <div className="flex justify-end">
                  <div className="mt-4 bg-gray-200 dark:bg-gray-600 h-8 w-32 animate-pulse" />
                </div>
              </div>
              <div className="bg-gray-200 dark:bg-gray-600 w-full h-[200px] md:h-full mt-2 animate-pulse block md:w-[45%] lg:w-[28%] xl:w-[45%]" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
export default Skelton