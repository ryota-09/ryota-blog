type InfoYearsCardProps = {
  diffYear: number
}

const InfoYearsCard = ({ diffYear }: InfoYearsCardProps) => {
  return (
    <div className="bg-yellow-200 p-2 md:p-4 inline-block">
      <p className="text-orange-400 font-bold text-sm md:text-md">
        こちらは <span className="text-xl md:text-2xl underline underline-offset-4">{diffYear}</span> 年前に公開された記事です
      </p>
    </div>
  )
}
export default InfoYearsCard;
