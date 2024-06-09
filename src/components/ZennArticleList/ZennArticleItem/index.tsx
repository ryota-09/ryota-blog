import NewLabel from "@/components/UiParts/NewLabel";
import { isWithinTwoWeeks } from "@/lib";

type ZennArticleType = {
  link: string;
  title: string;
  date: string;
}

const ZennArticleItem = ({ link, title, date }: ZennArticleType) => {
  return (
    <li className="relative bg-white dark:bg-black  border-[10px] border-zenn rounded-lg p-4 h-full min-h-[228.5px] flex flex-col items-center transition-opacity hover:opacity-70">
      {isWithinTwoWeeks(date) && <NewLabel className="absolute -top-4 -left-4 md:-left-6" />}
      <a href={link} target="_blank" rel="noreferrer" className="h-full flex items-center flex-col">
        <time className="text-xs lg:text-sm text-gray-400 dark:text-gray-500 w-full text-left" dateTime={date.split("T")[0]}>{date.split("T")[0].replaceAll("-", "/")}</time>
        <p className="flex flex-grow items-center text-txt-base dark:text-gray-300 text-lg md:text-md lg:text-xl">{title}</p>
      </a>
    </li>
  )
}
export default ZennArticleItem