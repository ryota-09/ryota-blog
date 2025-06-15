'use client';
import { useTranslations } from 'next-intl';

type InfoYearsCardProps = {
  diffYear: number
}

const InfoYearsCard = ({ diffYear }: InfoYearsCardProps) => {
  const t = useTranslations('blog');
  return (
    <div className="bg-yellow-200 p-2 md:p-4 inline-block">
      <p className="text-orange-400 font-bold text-sm md:text-md">
        {t.rich('oldArticleNotice', {
          years: (chunks) => <span className="text-xl md:text-2xl underline underline-offset-4">{chunks}</span>,
          diffYear: diffYear
        })}
      </p>
    </div>
  )
}
export default InfoYearsCard;
