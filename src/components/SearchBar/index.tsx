import { seachBlogByKeyword } from "@/lib/actions";

const SearchBar = () => {
  const _seachBlogByKeyword = seachBlogByKeyword.bind(null);

  return (
    <form className="flex justify-center w-full" action={_seachBlogByKeyword}>
      <input
        name="keyword"
        type="text"
        className="form-input w-full px-4 py-2 border-2 focus:outline-none focus:ring-2 focus:ring-base-color focus:border-transparent"
        placeholder="Search..."
      />
      <button
        type="submit"
        className="bg-base-color text-white px-2 ml-2 block my-0.5 transition-opacity hover:opacity-80 rounded-sm active:bg-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="10" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </form>
  )
}
export default SearchBar