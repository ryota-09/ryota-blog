import SocialMediaIcons from "@/components/Header/SocialMediaIcons";
import DarkModeToggle from "@/components/Header/DarkModeToggle";
import LanguageSwitch from "@/components/Header/LanguageSwitch";

interface SocialMediaNavProps {
  locale?: string;
}

const SocialMediaNav = ({ locale }: SocialMediaNavProps) => {
  return (
    <nav className="px-2 flex flex-wrap gap-5 md:gap-4">
      <SocialMediaIcons locale={locale} />
      <LanguageSwitch />
      <DarkModeToggle />
    </nav>
  );
}
export default SocialMediaNav;
