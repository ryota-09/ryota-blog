import BlogTitle from "@/components/Header/BlogTitle";
import { BLOG_TITLE } from "@/static/header";

const Header = () => {
  return (
    <header className="bg-white py-4 shadow-md">
      <div className="container mx-auto divide-y">
        <div className="flex justify-between items-center mb-4">
          <BlogTitle title={BLOG_TITLE} />
          <div>
            アイコン
          </div>
        </div>
        <nav>
          <ul className="flex space-x-4 mt-4 mx-1">
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Blog</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Portfolio</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
export default Header;