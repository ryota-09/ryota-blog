import { MapPin } from "lucide-react";
import SocialMediaIcons from "@/components/Header/SocialMediaIcons";
import Chip from "@/components/UiParts/Chip";
import ImageWithBlur from "@/components/UiParts/ImageWithBlur";
import { pickLocalized } from "@/lib/i18n-utils";
import { HERO_PROFILE } from "@/static/about";

type HeroSectionProps = {
  locale: string;
};

// ヒーローセクション。3秒で「何屋か」を伝えるパート
const HeroSection = ({ locale }: HeroSectionProps) => {
  const nameAlt = pickLocalized(HERO_PROFILE.nameAlt, locale);
  const catchphrase = pickLocalized(HERO_PROFILE.catchphrase, locale);
  const subText = pickLocalized(HERO_PROFILE.subText, locale);

  return (
    <section aria-labelledby="hero-heading" className="space-y-6">
      {/* モバイル: 画像と名前を横並び。md+ では下部の hidden md:grid 側を見せる */}
      <div className="flex items-start gap-4 md:hidden">
        <ImageWithBlur
          src="/author.png"
          alt={`${nameAlt} のプロフィール写真`}
          width={96}
          height={96}
          className="aspect-square w-20 rounded-full object-cover shadow-md"
          wrapperClassName="shrink-0"
          skeletonClassName="rounded-full"
          preload
        />
        <div>
          <h1
            id="hero-heading"
            className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100"
          >
            {nameAlt}
          </h1>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {HERO_PROFILE.badges.map((b) => (
              <Chip
                key={b}
                label={b}
                noTruncate
                classes="bg-base-color text-white px-2 py-0.5 text-[10px] font-mono min-w-0"
              />
            ))}
          </div>
        </div>
      </div>

      {/* PC: テキスト左／画像右の伝統的なレイアウト */}
      <div className="hidden md:grid grid-cols-[1fr_auto] gap-12 items-center">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {HERO_PROFILE.badges.map((b) => (
              <Chip
                key={b}
                label={b}
                noTruncate
                classes="bg-base-color text-white px-3 py-1 text-xs font-mono min-w-0"
              />
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100">
            {nameAlt}
          </h1>
        </div>
        <figure>
          <ImageWithBlur
            src="/author.png"
            alt={`${nameAlt} のプロフィール写真`}
            width={280}
            height={280}
            className="aspect-square w-[200px] md:w-[280px] rounded-full object-cover shadow-2xl"
            skeletonClassName="rounded-full"
            preload
          />
        </figure>
      </div>

      {/* キャッチコピー / サブテキスト / 所在地 / SNS（PCとモバイル共通） */}
      <p className="text-lg md:text-xl text-primary dark:text-base-color font-medium leading-snug text-balance">
        {catchphrase}
      </p>
      <p className="max-w-prose text-gray-700 dark:text-gray-300 leading-relaxed">
        {subText}
      </p>
      <p className="flex items-center gap-1.5 text-sm text-gray-500">
        <MapPin aria-hidden className="h-4 w-4 shrink-0" />
        {HERO_PROFILE.location}
      </p>
      <SocialMediaIcons locale={locale} />
    </section>
  );
};

export default HeroSection;
