import TOCItem from "@/components/ArticleBody/TOCList/TOCItem"
import type { TOCAssetsType } from "@/types"

type TOCListProps = {
  data: TOCAssetsType[]
}

const TOCList = ({ data }: TOCListProps) => {
  return (
    <div className="hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200 rounded-md hover:shadow-lg">
      <details>
        <summary className="py-6 px-4 text-2xl dark:text-gray-300 font-semibold w-full cursor-pointer marker:text-secondary">目次</summary>
        <nav className="ml-8 mr-1 md:ml-12 md:mr-12 pb-10">
          <ol className="space-y-8 list-decimal">
            {data.map(({ id, text, subList }) => (
              <div key={id}>
                <li className="group marker:text-black dark:marker:text-gray-300 hover:marker:text-base-color marker:duration-300">
                  <TOCItem
                    id={id}
                    classes="block text-black text-lg group-hover:text-base-color dark:text-gray-300 dark:hover:text-gray-50 duration-300 transition-colors"
                  >
                    {text}
                  </TOCItem>
                </li>
                <ul className="space-y-1 mt-2">
                  {subList.length > 0 && (
                    subList.map(({ id, text }) => (
                      <li key={id}>
                        <TOCItem
                          id={id}
                          classes=" indent-4 block text-gray-500 hover:text-base-color dark:text-gray-400 dark:hover:text-gray-50 transition-colors duration-300"
                        >
                          {text}
                        </TOCItem>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </ol>
        </nav>
      </details>
    </div>
  )
}
export default TOCList