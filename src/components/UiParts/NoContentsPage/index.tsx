import ImageWithLoader from "@/components/UiParts/ImageWithLoader";

const NoContents = () => {
  return (
    <div className="h-full bg-white border-2 border-gray-200 py-16 px-4 flex justify-center items-center">
      <ImageWithLoader src="/no_contents.png" alt="No contents" width={300} height={300} sizes="100vw" style={{ width: '50%', height: 'auto' }} />
      <div>
        <p>表示するコンテンツがありません。</p>
      </div>
    </div>
  );
}
export default NoContents;