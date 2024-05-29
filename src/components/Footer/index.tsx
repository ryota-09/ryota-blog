import FooterNav from "@/components/Footer/FooterNav";
import { FOOTER_NAV_ITEMS } from "@/static/footer";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black py-4 shadow-inner">
      <div className="container mx-auto divide-y dark:divide-[#333] px-2 md:px-0">
        <div className="flex justify-between items-center pb-6">
          <FooterNav items={FOOTER_NAV_ITEMS} />
        </div>
        <div className="text-gray-600 flex justify-end pt-4">
          &copy; {new Date().getFullYear()} りょたぶろぐ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
export default Footer;