import { Link } from 'next-view-transitions';

type CategoryItemProps = {
  categoryName: string;
}

const CategoryItem = ({ categoryName }: CategoryItemProps) => {
  return (
    <Link href={`/blogs?category=${categoryName}`} className="md:w-full block text-white md:text-txt-base dark:md:text-gray-500 text-md leading-tight font-medium bg-secondary md:bg-transparent rounded-full md:rounded-none transition duration-200 hover:text-base-color dark:md:hover:text-primary dark:hover:text-gray-100 dark:hover:opacity-90">
      <li className="p-2 md:p-4 flex items-center justify-center md:justify-start gap-2">
        <p>{categoryName}</p>
      </li>
    </Link>
  )
}
export default CategoryItem;