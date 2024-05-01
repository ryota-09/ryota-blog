import Link from "next/link";

type PropsType ={
  title: string;
}

const BlogTitle = ({ title }: PropsType) => {
  return (
    <Link href="/">
      <h1 className="text-xl font-bold text-gray-600 transition duration-200 hover:text-base-color">{title}</h1>
    </Link>
  )
}
export default BlogTitle;