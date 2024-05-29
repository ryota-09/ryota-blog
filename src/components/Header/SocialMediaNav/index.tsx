import { SOCIAL_MEDIA_NAV_ITEMS } from "@/static/header";

const SocialMediaNav = () => {
  return (
    <nav className="flex gap-8 md:gap-4">
      <a href={SOCIAL_MEDIA_NAV_ITEMS[0].href} target="_blank" rel="noreferrer" className="w-8 h-8 text-lg text-gray-400 border dark:border-[#333] rounded-md font-extrabold flex justify-center items-center hover:opacity-70 hover:bg-accent" style={{ fontFamily: "initial" }}>
        {SOCIAL_MEDIA_NAV_ITEMS[0].name}
      </a>
      <a href={SOCIAL_MEDIA_NAV_ITEMS[1].href} target="_blank" rel="noreferrer" className="w-8 h-8 text-lg text-gray-400 border dark:border-[#333] rounded-md font-extrabold flex justify-center items-center transition hover:opacity-70 hover:bg-zenn hover:text-white" style={{ fontFamily: "sans-serif" }}>
        {SOCIAL_MEDIA_NAV_ITEMS[1].name}
      </a>
      <a href={SOCIAL_MEDIA_NAV_ITEMS[2].href} target="_blank" rel="noreferrer" className="w-8 h-8 text-lg text-gray-400 border dark:border-[#333] rounded-md font-extrabold flex justify-center items-center transition hover:opacity-70 hover:bg-black dark:hover:bg-gray-400 hover:text-white" style={{ fontFamily: "sans-serif" }}>
        {SOCIAL_MEDIA_NAV_ITEMS[2].name}
      </a>
    </nav>
  );
}
export default SocialMediaNav;