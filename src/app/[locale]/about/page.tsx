import AboutMeSection from "./_components/AboutMeSection";
import CareerTimeline from "./_components/CareerTimeline";
import ContactSection from "./_components/ContactSection";
import HeroSection from "./_components/HeroSection";
import MissionSection from "./_components/MissionSection";
import PersonJsonLd from "./_components/PersonJsonLd";
import SkillStack from "./_components/SkillStack";

type AboutPageProps = {
  params: Promise<{
    locale: string;
  }>;
}

// aboutページ。10セクションを縦に並べる
const Page = async ({ params }: AboutPageProps) => {
  const { locale } = await params;

  return (
    <article className="mx-auto w-full max-w-4xl flex-grow space-y-16 bg-white px-4 py-12 sm:px-6 md:space-y-24 md:py-16 lg:px-8 dark:bg-black">
      <HeroSection locale={locale} />
      <AboutMeSection locale={locale} />
      <MissionSection locale={locale} />
      <CareerTimeline locale={locale} />
      <SkillStack locale={locale} />
      <ContactSection locale={locale} />
      <PersonJsonLd locale={locale} />
    </article>
  );
};

export default Page;
