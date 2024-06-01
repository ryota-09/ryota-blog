"use client"

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Metadata } from "next";
import { Link } from 'next-view-transitions';
import Image from "next/image";

export const metadata: Metadata = {
  title: "Error"
};

const Page = () => {
  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col md:flex-row container mx-auto gap-4 my-4 h-full px-2">
        <div className="flex w-full flex-col items-center justify-center bg-white px-4 py-12 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600">
          <div className="flex flex-col items-center justify-center space-y-4">
          <Image src="/500.png" alt="Internal Server Error" width={300} height={300} sizes="100vw" style={{ width: '50%', height: 'auto' }} />
            <h1 className="text-8xl font-bold text-gray-800 dark:text-gray-200">500</h1>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
              サーバー内部のエラーが発生しました。
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