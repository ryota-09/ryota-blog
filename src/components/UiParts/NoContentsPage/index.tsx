import { Link } from "next-view-transitions";
import Image from "next/image";

const NoContents = () => {
  return (
    <div className="h-full bg-white dark:bg-black border-2 border-gray-200 dark:dark:border-gray-600 py-4 px-4 flex justify-center items-center gap-4">
      <Image src="/no_contents.png" alt="No contents" width={300} height={300} sizes="100vw" style={{ width: '50%', height: 'auto' }} />
      <div className="flex flex-col gap-8">
        <p className="dark:text-gray-400">表示できるコンテンツがありません。</p>
        <Link href="/blogs" className="text-base-color border-2 border-base-color w-fit px-4 py-2 hover:bg-base-color hover:text-white hover:border-base-color transition duration-200">
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}
export default NoContents;