import Image from "next/image";

import { SOCIAL_MEDIA_NAV_ITEMS } from "@/static/header";

const SocialMediaNav = () => {
  return (
    <nav className="flex gap-5 md:gap-4">
      <a href={SOCIAL_MEDIA_NAV_ITEMS[0].href} target={SOCIAL_MEDIA_NAV_ITEMS[0].target} rel="noreferrer" className="w-8 h-8  border dark:border-[#333] dark:bg-gray-400 rounded-md font-extrabold flex justify-center items-center opacity-50 hover:opacity-30">
        <Image src={SOCIAL_MEDIA_NAV_ITEMS[0].icon ?? ""} alt={SOCIAL_MEDIA_NAV_ITEMS[0].name} width={20} height={20} />
      </a>
      <a href={SOCIAL_MEDIA_NAV_ITEMS[1].href} target={SOCIAL_MEDIA_NAV_ITEMS[1].target} rel="noreferrer" className="w-8 h-8  border dark:border-[#333] dark:bg-gray-400 rounded-md font-extrabold flex justify-center items-center transition opacity-50 hover:opacity-30 hover:bg-zenn">
        <Image src={SOCIAL_MEDIA_NAV_ITEMS[1].icon ?? ""} alt={SOCIAL_MEDIA_NAV_ITEMS[1].name} width={20} height={20} />
      </a>
      <a href={SOCIAL_MEDIA_NAV_ITEMS[2].href} target={SOCIAL_MEDIA_NAV_ITEMS[2].target} rel="noreferrer" className="w-8 h-8  border dark:border-[#333] dark:bg-gray-400 rounded-md font-extrabold flex justify-center items-center transition opacity-50 hover:opacity-30">
        <Image src={SOCIAL_MEDIA_NAV_ITEMS[2].icon ?? ""} alt={SOCIAL_MEDIA_NAV_ITEMS[2].name} width={20} height={20} />
      </a>
      <a href={SOCIAL_MEDIA_NAV_ITEMS[3].href} target={SOCIAL_MEDIA_NAV_ITEMS[3].target} className="w-8 h-8  border dark:border-[#333] dark:bg-gray-400 rounded-md font-extrabold flex justify-center items-center transition opacity-50 hover:opacity-30 hover:bg-[#FF4785]">
        <Image src={SOCIAL_MEDIA_NAV_ITEMS[3].icon ?? ""} alt={SOCIAL_MEDIA_NAV_ITEMS[3].name} width={20} height={20} />
      </a>
      <a href={SOCIAL_MEDIA_NAV_ITEMS[4].href} target={SOCIAL_MEDIA_NAV_ITEMS[4].target} className="w-8 h-8  border dark:border-[#333] dark:bg-gray-400 rounded-md font-extrabold flex justify-center items-center transition opacity-50 hover:opacity-30">
        <Image src={SOCIAL_MEDIA_NAV_ITEMS[4].icon ?? ""} alt={SOCIAL_MEDIA_NAV_ITEMS[4].name} width={20} height={20} />
      </a>
    </nav>
  );
}
export default SocialMediaNav;