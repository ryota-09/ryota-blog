import ZennArticleItem from "@/components/ZennArticleList/ZennArticleItem"
import data from "@/static/rss/data.json"

const ZennArticleList = () => {
  return (
    <ul className="grid grid-cols-2 xl:grid-cols-3 gap-8">
      {data.map(({ link, title, isoDate }, index) => (
        <ZennArticleItem key={index} link={link} title={title} date={isoDate} />
      ))}
    </ul>
  )
}
export default ZennArticleList