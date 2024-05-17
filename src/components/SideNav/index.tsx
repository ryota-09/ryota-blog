import CategoryList from "@/components/CategoryList";
import SearchBar from "@/components/SearchBar";

const SideNav = () => {
  return (
    <aside className="w-full md:w-[300px] flex flex-col gap-8 px-2 md:px-0">
      <div className="mt-6">
        <SearchBar />
      </div>
      <CategoryList />
    </aside>
  )
}

export default SideNav;