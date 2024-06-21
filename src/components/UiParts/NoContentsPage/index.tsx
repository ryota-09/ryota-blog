import ImageWithBlur from "@/components/UiParts/ImageWithBlur";
import { Link } from "next-view-transitions";

const NoContents = () => {
  return (
    <div className="h-full bg-white dark:bg-black border-2 border-gray-200 dark:dark:border-gray-600 py-4 px-4 flex flex-col md:flex-row justify-center items-center">
      <ImageWithBlur src="/no_contents.png" alt="No contents" width={300} height={300} sizes="100vw" style={{ width: '60%', height: 'auto' }} className="max-h-[500px]" />
      <div className="flex flex-col gap-8">
        <p className="dark:text-gray-400 text-center md:text-left">表示できるコンテンツが<br className="inline md:hidden" />ありません。</p>
        <div className="flex justify-center md:justify-start">
          <Link href="/blogs" className="text-base-color border-2 border-base-color w-fit px-4 py-2 hover:bg-base-color hover:text-white hover:border-base-color transition duration-200">
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
export default NoContents;