
type ZennArticleType = {
  link: string;
  title: string;
  date: string;
}

const ZennArticleItem = ({ link, title, date }: ZennArticleType) => {
  return (
    <a href={link} target="_blank">
      <li className="bg-white  border-[10px] border-zenn rounded-lg p-4 h-full min-h-[226px] flex flex-col items-center transition-opacity hover:opacity-70">
        <time className="text-xs lg:text-sm text-gray-400 w-full text-left" dateTime={date.split("T")[0]}>{date.split("T")[0].replaceAll("-", "/")}</time>
        <p className="flex flex-grow items-center text-txt-base text-lg md:text-md lg:text-xl">{title}</p>
      </li>
    </a>
  )
}
export default ZennArticleItem