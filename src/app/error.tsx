"use client"

import ErrorPageFooter from "@/components/ErrorPageFooter";
import ErrorPageHeader from "@/components/ErrorPageHeader";
import { Link } from 'next-view-transitions';
import Image from "next/image";
import { usePathname } from 'next/navigation';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const Page = ({ error, reset }: ErrorPageProps) => {
  const pathname = usePathname();
  // パスからロケールを取得（デフォルトは日本語）
  const locale = pathname?.startsWith('/en') ? 'en' : 'ja';
  
  // ロケールに応じた翻訳を手動で定義
  const messages = {
    ja: {
      message: 'サーバー内部のエラーが発生しました。',
      backToHome: 'トップページに戻る'
    },
    en: {
      message: 'An internal server error occurred.',
      backToHome: 'Back to Home'
    }
  };
  
  const t = messages[locale as keyof typeof messages];
  
  return (
    <>
      <ErrorPageHeader locale={locale} />
      <main className="flex-grow flex flex-col md:flex-row container mx-auto gap-4 my-4 h-full px-2">
        <div className="flex w-full flex-col items-center justify-center bg-white px-4 py-12 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600">
          <div className="flex flex-col items-center justify-center space-y-4">
          <Image src="/500.png" alt="Internal Server Error" width={300} height={300} sizes="100vw" style={{ width: '50%', height: 'auto' }} />
            <h1 className="text-8xl font-bold text-gray-800 dark:text-gray-200">500</h1>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
              {t.message}
            </p>
            <Link href={`/${locale}/blogs`} className="text-base-color border-2 border-base-color px-4 py-2 hover:bg-base-color hover:text-white hover:border-base-color transition duration-200">
              {t.backToHome}
            </Link>
          </div>
        </div>
      </main>
      <ErrorPageFooter locale={locale} />
    </>
  )
}
export default Page