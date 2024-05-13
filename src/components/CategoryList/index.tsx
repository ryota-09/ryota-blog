import CategoryItem from "@/components/CategoryList/CategoryItem";
import { getCategoryList } from "@/lib/microcms";

const CategoryList = async () => {
  const data = await getCategoryList();
  return (
    <div>
      <div className="text-xl mb-8 px-0.5">Category</div>
      <ul className="divide-y divide-gray-300">
        {data.contents.map(({ name }, index) => (
          <CategoryItem key={index} categoryName={name} />
        ))}
      </ul>
    </div>
  )
}
export default CategoryList;