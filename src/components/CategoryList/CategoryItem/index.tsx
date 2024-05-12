import Link from "next/link";

type CategoryItemProps = {
  categoryName: string;
}

const CategoryItem = ({ categoryName }: CategoryItemProps) => {
  return (
    <Link href={`/blogs?category=${categoryName}`} className="w-full block text-txt-base text-md leading-tight font-medium transition duration-200 hover:text-base-color">
      <li className="py-4 px-4 flex items-center gap-2">
        <p>{categoryName}</p>
      </li>
    </Link>
  )
}
export default CategoryItem;