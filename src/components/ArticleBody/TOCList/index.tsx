import { TOCAssetsType } from "@/types"

type TOCListProps = {
  data: TOCAssetsType[]
}

const TOCList = ({ data }: TOCListProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 rounded-md shadow-lg">
      <details className="p-6">
        <summary className="text-2xl font-semibold w-full cursor-pointer transition-opacity hover:opacity-50 marker:text-secondary">目次</summary>
        <nav className="mx-12 my-8">
          <ol className="space-y-8 list-decimal">
            {data.map(({ id, text, subList }) => (
              <div key={id} className=" ">
                <li className="group marker:text-black hover:marker:text-base-color marker:duration-300">
                  <a
                    id={id}
                    className=" block text-black text-lg group-hover:text-base-color dark:text-gray-400 dark:hover:text-gray-50 duration-300 transition-colors"
                    href="#"
                  >
                    {text}
                  </a>
                </li>
                <div className="space-y-1 mt-2">
                  {subList.length > 0 && (
                    subList.map(({ id, text }) => (
                      <a
                        id={id}
                        className=" indent-4 block text-gray-500 hover:text-base-color dark:text-gray-400 dark:hover:text-gray-50 transition-colors duration-300"
                        href="#"
                      >
                        {text}
                      </a>
                    ))
                  )}
                </div>
              </div>
            ))}
          </ol>
        </nav>
      </details>
    </div>
  )
}
export default TOCList