import { headers } from "next/headers";

// ※ 本来なら環境変数として利用する
const CUSTOM_HEADER_KEY_NAME = 'custom-header-value'

const Page = () => {
  const customHeaderValue = headers().get(CUSTOM_HEADER_KEY_NAME);
  return (
    <>
      <div className="absolute top-0 left-4 text-3xl font-bold bg-white h-full w-full">Sample Page</div>
      <p>カスタムヘッダー: {customHeaderValue || "該当するヘッダーはありません。"}</p>
    </>
  )
}
export default Page;