import BlogTitle from "@/components/Header/BlogTitle";
import HeaderNav from "@/components/Header/HeaderNav";
import SPNav from "@/components/Header/SPNav";
import SocialMediaNav from "@/components/Header/SocialMediaNav";
import { BLOG_TITLE, HEADER_NAV_ITEMS } from "@/static/header";

const Header = () => {
  return (
    <header className="bg-white pt-4 shadow-md">
      <div className="container mx-auto divide-y">
        <div className="flex justify-between items-center mb-4 px-2 md:px-0">
          <div className="flex justify-between w-full">
            <BlogTitle title={BLOG_TITLE} />
            <div className="hidden md:block">
              <SocialMediaNav />
            </div>
          </div>
          <div className="block md:hidden">
            <SPNav />
          </div>
        </div>
        <HeaderNav items={HEADER_NAV_ITEMS} />
      </div>
    </header>
  )
}
export default Header;