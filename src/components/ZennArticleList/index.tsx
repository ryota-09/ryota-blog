import { getTranslations } from 'next-intl/server'
import Accordion from "@/components/UiParts/Accordion"
import ZennArticleItem from "@/components/ZennArticleList/ZennArticleItem"
import NoContentsPage from "@/components/UiParts/NoContentsPage"
import data from "@/static/rss/data.json"

type ZennArticleListProps = {
  locale: string;
  keyword?: string;
}

const ZennArticleList = async ({ locale, keyword }: ZennArticleListProps) => {
  const t = await getTranslations({ locale, namespace: 'blog' });

  // キーワードでフィルタリング（タイトルまたはcontentの部分一致、大文字小文字区別なし）
  const filteredData = keyword
    ? data.filter(article => {
        const lowerKeyword = keyword.toLowerCase();
        return (
          article.title.toLowerCase().includes(lowerKeyword) ||
          (article.content && article.content.toLowerCase().includes(lowerKeyword))
        );
      })
    : data;

  // 検索結果0件の場合
  if (filteredData.length === 0) {
    return <NoContentsPage returnPath="/blogs/zenn" blogType="zenn" />;
  }
  return (
    // NOTE: フッターの位置を調整するため、mb-[101px]を追加
    <nav className="opacity-0 animate-fadeIn mb-[101px]">
      <ul className="m-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredData.slice(0, 6).map(({ link, title, isoDate }, index) => (
          <ZennArticleItem key={index} link={link} title={title} date={isoDate} keyword={keyword} />
        ))}
      </ul>
      {filteredData.length > 6 && (
        <Accordion title={t('showMore')} classes="w-full p-4 cursor-pointer text-center transition hover:bg-blue-100 hover:opacity-70 duration-300 group-open:bg-transparent group-open:opacity-0 group-open:cursor-auto group-open:p-0">
          <ul className="group-open:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 hidden">
            {filteredData.slice(6).map(({ link, title, isoDate }, index) => (
              <ZennArticleItem key={index} link={link} title={title} date={isoDate} keyword={keyword} />
            ))}
          </ul>
        </Accordion>
      )}
    </nav>
  )
}
export default ZennArticleList