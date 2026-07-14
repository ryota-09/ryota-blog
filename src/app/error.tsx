"use client"

import ErrorPageFooter from "@/components/ErrorPageFooter";
import ErrorPageHeader from "@/components/ErrorPageHeader";
import { Link } from 'next-view-transitions';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import "../styles/globals.css";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
}

// [locale]/layout.tsxがroot layout化されたため(Issue #293)、このファイルは[locale]/layout.tsx
// 自身がthrowした場合の境界としてsrc/app/直下(上位layoutなし)で処理する。そのため<html>/<body>を
// 自前で持つ(global-error.tsxと同じ理由。global-error.tsxはこのerror.tsx自身が失敗した場合の
// さらに上位のフォールバック)
const Page = ({ error, reset }: ErrorPageProps) => {
  const pathname = usePathname();
  // パスからロケールを取得（デフォルトは日本語）
  const locale = pathname?.startsWith('/en') ? 'en' : 'ja';

  // エラーバウンダリで捕捉した例外をログ出力する（監視サービスへの送信ポイント）
  useEffect(() => {
    console.error('[error-boundary]', error.digest ?? '', error.message);
  }, [error]);

  // ロケールに応じた翻訳を手動で定義
  const messages = {
    ja: {
      message: 'サーバー内部のエラーが発生しました。',
      backToHome: 'トップページに戻る',
      retry: '再試行する'
    },
    en: {
      message: 'An internal server error occurred.',
      backToHome: 'Back to Home',
      retry: 'Try again'
    }
  };
  
  const t = messages[locale as keyof typeof messages];

  return (
    <html lang={locale}>
      <body className="bg-[#eee] dark:bg-[#333] flex flex-col min-h-screen overflow-x-hidden">
        <ErrorPageHeader locale={locale} />
        <main className="flex-grow flex flex-col md:flex-row container mx-auto gap-4 my-4 h-full px-2">
          <div className="flex w-full flex-col items-center justify-center bg-white px-4 py-12 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600">
            <div className="flex flex-col items-center justify-center space-y-4">
            <Image src="/500.png" alt="Internal Server Error" width={300} height={300} sizes="100vw" style={{ width: '50%', height: 'auto' }} />
              <h1 className="text-8xl font-bold text-gray-800 dark:text-gray-200">500</h1>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                {t.message}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => reset()} className="text-white bg-base-color border-2 border-base-color px-4 py-2 hover:opacity-90 transition duration-200">
                  {t.retry}
                </button>
                <Link href={`/${locale}/blogs`} className="text-base-color border-2 border-base-color px-4 py-2 hover:bg-base-color hover:text-white hover:border-base-color transition duration-200">
                  {t.backToHome}
                </Link>
              </div>
            </div>
          </div>
        </main>
        <ErrorPageFooter locale={locale} />
      </body>
    </html>
  )
}
export default Page