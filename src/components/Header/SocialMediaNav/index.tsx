import SocialMediaIcons from "@/components/Header/SocialMediaIcons";
import DarkModeToggle from "@/components/Header/DarkModeToggle";
import LanguageSwitch from "@/components/Header/LanguageSwitch";

interface SocialMediaNavProps {
  locale?: string;
}

const SocialMediaNav = ({ locale }: SocialMediaNavProps) => {
  return (
    <nav className="flex flex-wrap gap-5 px-2 md:gap-4" role="navigation">
      <SocialMediaIcons locale={locale} />
      <LanguageSwitch />
      <DarkModeToggle />
    </nav>
  );
};
export default SocialMediaNav;
