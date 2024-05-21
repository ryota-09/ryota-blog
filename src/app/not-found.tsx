import type { Metadata } from "next";
import { Link } from 'next-view-transitions'

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ImageWithLoader from "@/components/UiParts/ImageWithLoader"

export const metadata: Metadata = {
  title: "Not Found"
};

const Page = () => {
  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col md:flex-row container mx-auto gap-4 my-4 h-full px-2">
        <div className="flex w-full flex-col items-center justify-center bg-white px-4 py-6 dark:bg-gray-900 border-2 border-gray-200">
          <div className="flex flex-col items-center justify-center space-y-4">
            <ImageWithLoader src="/404.png" alt="No contents" width={300} height={300} sizes="100vw" style={{ width: '50%', height: 'auto' }} />
            <h1 className="text-8xl font-bold text-gray-800 dark:text-gray-200">404</h1>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
              お探しのページが見つかりませんでした。
            </p>
            <Link href="/blogs" className="text-base-color border-2 border-base-color px-4 py-2 hover:bg-base-color hover:text-white hover:border-base-color transition duration-200">
              トップページに戻る
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
export default Page