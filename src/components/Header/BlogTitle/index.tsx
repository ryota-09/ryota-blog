import { Link } from 'next-view-transitions';

type PropsType = {
  title: string;
  locale?: string;
}

const BlogTitle = ({ title, locale }: PropsType) => {
  const href = locale ? `/${locale}` : '/';
  
  return (
    <Link href={href}>
      <h1 className="text-md md:text-xl font-bold text-black dark:text-gray-400 transition duration-200 hover:text-base-color shrink-0">{title}</h1>
    </Link>
  )
}
export default BlogTitle;