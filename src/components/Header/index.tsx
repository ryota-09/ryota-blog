import BlogTitle from "@/components/Header/BlogTitle";
import LocaleAwareHeaderNav from "@/components/Header/LocaleAwareHeaderNav";
import SPNav from "@/components/Header/SPNav";
import SocialMediaNav from "@/components/Header/SocialMediaNav";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { SITE_TITLE } from "@/static/blogs";
import { HEADER_NAV_ITEMS } from "@/static/header";

interface HeaderProps {
  locale?: string;
}

const Header = ({ locale }: HeaderProps) => {
  return (
    <header className="bg-white dark:bg-black pt-4 shadow-md">
      <div className="container mx-auto divide-y dark:divide-[#333]">
        <div className="flex justify-between items-center mb-4 px-2 md:px-0">
          <div className="flex justify-between w-full">
            <BlogTitle title={SITE_TITLE} locale={locale} />
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <SocialMediaNav locale={locale} />
              </div>
              <LanguageSwitcher />
            </div>
          </div>
          <div className="block md:hidden">
            <SPNav locale={locale} />
          </div>
        </div>
        <LocaleAwareHeaderNav items={HEADER_NAV_ITEMS} locale={locale} />
      </div>
    </header>
  )
}
export default Header;