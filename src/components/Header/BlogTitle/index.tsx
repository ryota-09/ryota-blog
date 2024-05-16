import Link from "next/link";

type PropsType ={
  title: string;
}

const BlogTitle = ({ title }: PropsType) => {
  return (
    <Link href="/blogs">
      <h1 className="text-md md:text-xl font-bold text-black transition duration-200 hover:text-base-color shrink-0">{title}</h1>
    </Link>
  )
}
export default BlogTitle;