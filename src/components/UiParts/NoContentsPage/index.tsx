import Image from "next/image";

const NoContents = () => {
  return (
    <div className="h-full bg-white dark:bg-black border-2 border-gray-200 dark:dark:border-gray-600 min-h-[236px] py-12 px-4 flex justify-center items-center gap-4">
      <Image src="/no_contents.png" alt="No contents" width={300} height={300} sizes="100vw" style={{ width: '50%', height: 'auto' }} />
      <div>
        <p className="dark:text-gray-400">表示できるコンテンツがありません。</p>
      </div>
    </div>
  );
}
export default NoContents;