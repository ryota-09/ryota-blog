import AdBanner from "@/components/AdBanner";
import CategoryList from "@/components/CategoryList";
import SearchBar from "@/components/SearchBar";

type SideNavProps = {
  locale: string;
}

const SideNav = ({ locale }: SideNavProps) => {
  return (
    <aside className="w-full md:w-[300px] flex flex-col gap-4 px-2 md:px-0">
      {/* タブ領域(72px)と高さを揃えるためにmd:pt-7で上部余白を確保 */}
      <div className="md:pt-7">
        <SearchBar />
      </div>
      {/* PC版: カテゴリ上に広告募集ウィジェットを配置（カードの高さに合わせる） */}
      <div className="hidden md:block">
        <AdBanner variant="sidebar" />
      </div>
      <CategoryList locale={locale} />
    </aside>
  )
}

export default SideNav;