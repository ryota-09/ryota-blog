import Accordion from "@/components/UiParts/Accordion"
import ZennArticleItem from "@/components/ZennArticleList/ZennArticleItem"
import data from "@/static/rss/data.json"

const ZennArticleList = () => {
  return (
    <>
      <ul className="m-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {data.slice(0, 6).map(({ link, title, isoDate }, index) => (
          <ZennArticleItem key={index} link={link} title={title} date={isoDate} />
        ))}
      </ul>
      <Accordion title="もっと見る" classes="w-full p-4 cursor-pointer text-center transition hover:bg-blue-100 hover:opacity-70 duration-300 group-open:bg-transparent group-open:opacity-0 group-open:cursor-auto group-open:p-0">
        <ul className="group-open:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 hidden">
          {data.slice(6).map(({ link, title, isoDate }, index) => (
            <ZennArticleItem key={index} link={link} title={title} date={isoDate} />
          ))}
        </ul>
      </Accordion>
    </>
  )
}
export default ZennArticleList