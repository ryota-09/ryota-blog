import BlogTitle from "@/components/Header/BlogTitle";
import HeaderNav from "@/components/Header/HeaderNav";
import { BLOG_TITLE, HEADER_NAV_ITEMS } from "@/static/header";

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
        <HeaderNav items={HEADER_NAV_ITEMS} />
      </div>
    </header>
  )
}
export default Header;