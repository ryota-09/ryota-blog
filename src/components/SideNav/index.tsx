import CategoryList from "@/components/CategoryList";
import SearchBar from "@/components/SearchBar";

const SideNav = () => {
  return (
    <aside className="w-full md:w-[300px] flex flex-col gap-8">
      <div className="mt-6">
        <SearchBar />
      </div>
      <CategoryList />
    </aside>
  )
}

export default SideNav;