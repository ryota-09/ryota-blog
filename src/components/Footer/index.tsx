import FooterNav from "@/components/Footer/FooterNav";
import { SITE_TITLE } from "@/static/blogs";
import { FOOTER_NAV_ITEMS } from "@/static/footer";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black py-4 shadow-inner">
      <div className="container mx-auto divide-y dark:divide-[#333] px-2 md:px-0">
        <FooterNav items={FOOTER_NAV_ITEMS} />
        <div className="text-gray-600 flex justify-end pt-4">
          &copy; {`${new Date().getFullYear()} ${SITE_TITLE}. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}
export default Footer;