import { TOCAssetsType } from "@/types"

type TOCListProps = {
  data: TOCAssetsType[]
}

const TOCList = ({ data }: TOCListProps) => {
  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
        <nav className="space-y-2">
          {data.map(({ id, text, subList }) => (
            <div>
              <a
                key={id}
                id={id}
                className="block text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors"
                href="#"
              >
                {text}
              </a>
              {subList.length > 0 && (
                subList.map(({ id, text }) => (
                  <a
                    id={id}
                    className="block text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors pl-4"
                    href="#"
                  >
                    {text}
                  </a>
                ))
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
export default TOCList