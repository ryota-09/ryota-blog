import CategoryList from "@/components/CategoryList";
import SearchBar from "@/components/SearchBar";

type SideNavProps = {
  locale: string;
}

const SideNav = ({ locale }: SideNavProps) => {
  return (
    <aside className="w-full md:w-[300px] flex flex-col gap-8 px-2 md:px-0">
      <div className="mt-7">
        <SearchBar />
      </div>
      <CategoryList locale={locale} />
    </aside>
  )
}

export default SideNav;