import type { Metadata } from "next";
import { Link } from '@/i18n/navigation';
import Image from "next/image";
import ErrorPageFooter from "@/components/ErrorPageFooter";
import ErrorPageHeader from "@/components/ErrorPageHeader";

export const metadata: Metadata = {
  title: "ページが見つかりません"
};

const NotFoundPage = () => {
  // サーバーサイドではデフォルトlocaleを使用
  const locale = 'ja';
  
  const messages = {
    ja: {
      message: 'お探しのページが見つかりませんでした。',
      backToHome: 'トップページに戻る'
    },
    en: {
      message: 'The page you are looking for could not be found.',
      backToHome: 'Back to Home'
    }
  };
  
  const t = messages[locale as keyof typeof messages];
  
  return (
    <>
      <ErrorPageHeader locale={locale} />
      <main className="flex-grow flex flex-col md:flex-row container mx-auto gap-4 my-4 h-full px-2">
        <div className="flex-grow flex w-full flex-col items-center justify-center bg-white p-4 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600">
          <div className="flex flex-col items-center justify-center space-y-4">
          <Image src="/404.png" alt="No contents" width={300} height={300} sizes="100vw" style={{ width: '50%', height: 'auto' }} />
            <h1 className="text-8xl font-bold text-gray-800 dark:text-gray-200">404</h1>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
              {t.message}
            </p>
            <Link href="/blogs" className="text-base-color border-2 border-base-color px-4 py-2 hover:bg-base-color hover:text-white hover:border-base-color transition duration-200">
              {t.backToHome}
            </Link>
          </div>
        </div>
      </main>
      <ErrorPageFooter locale={locale} />
    </>
  )
}

export default NotFoundPage;