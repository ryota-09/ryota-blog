import CategoryList from "@/components/CategoryList";
import SearchBar from "@/components/SearchBar";

const SideNav = () => {
  return (
    <aside className="w-[300px] flex flex-col gap-8">
      <SearchBar />
      <CategoryList />
    </aside>
  )
}

export default SideNav;