import CategoryItem from "@/components/CategoryList/CategoryItem";
import { getAllCategoryList } from "@/lib/microcms";
import Accordion from "@/components/UiParts/Accordion";

const CategoryList = async () => {
  const data = await getAllCategoryList({ fields: "id,name" });
  return (
    <div>
      <div className="text-xl mb-8 px-0.5 dark:text-gray-400">Category</div>
      <ul className="divide-y-0 md:divide-y divide-gray-300 dark:divide-gray-600 flex flex-wrap gap-4 md:gap-0 md:flex-col">
        {data.slice(0, 5).map(({ id, name }) => (
          <CategoryItem key={id} categoryName={name} />
        ))}
      </ul>
      <Accordion title="その他のカテゴリ" classes="mt-4 md:mt-0 w-full p-4 cursor-pointer text-center transition hover:bg-light hover:opacity-70 duration-300 group-open:bg-transparent group-open:opacity-0 group-open:cursor-auto group-open:p-0 group-open:h-0">
        <ul className="border-t-0 md:border-t dark:md:border-t-gray-600 divide-y-0 md:divide-y divide-gray-300 border-gray-300 dark:divide-gray-600 flex flex-wrap gap-4 md:gap-0 md:flex-col">
          {data.slice(5).map(({ id, name }) => (
            <CategoryItem key={id} categoryName={name} />
          ))}
        </ul>
      </Accordion>
    </div>
  )
}
export default CategoryList;