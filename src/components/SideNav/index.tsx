import { Suspense } from "react";

import CategoryList from "@/components/CategoryList";
import Skelton from "@/components/CategoryList/skelton";
import SearchBar from "@/components/SearchBar";

const SideNav = () => {
  return (
    <aside className="w-full md:w-[300px] flex flex-col gap-8 px-2 md:px-0">
      <div className="mt-7">
        <SearchBar />
      </div>
      <Suspense fallback={<Skelton />}>
        <CategoryList />
      </Suspense>
    </aside>
  )
}

export default SideNav;