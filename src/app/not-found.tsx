import type { Metadata } from "next";
import NotFoundContent from "@/components/NotFoundContent";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "ページが見つかりません"
};

// [locale]/layout.tsxがroot layout化されたため(Issue #293)、このファイルはsrc/app/直下に
// 残る唯一のnot-foundとして次の2ケースを処理する:
//   1. ビルド出力の特殊ルート /_not-found (どのセグメントにもマッチしないURL)
//   2. [locale]/layout.tsx 自身がnotFound()を呼んだ場合(不正なlocaleセグメント)
//      -> layout自身がthrowするため[locale]/layout.tsxにはラップしてもらえず、
//         この境界がsrc/app/直下(上位layoutなし)で処理する
// [locale]配下のページ内(記事未存在等)のnotFound()は src/app/[locale]/not-found.tsx が処理し、
// そちらは[locale]/layout.tsxに包まれるためフォント・テーマ等は通常通り適用される。
// このファイルは上位layoutが存在しないため<html>/<body>を自前で持つ(global-error.tsxと同じ理由)。
// この時点ではlocaleが未確定のため<html lang>は既定値(ja)を出力し、表示文言はNotFoundContent側で
// pathnameから判定する
const Page = () => {
  return (
    <html lang="ja">
      <body className="bg-[#eee] dark:bg-[#333] flex flex-col min-h-screen overflow-x-hidden">
        <NotFoundContent />
      </body>
    </html>
  );
}
export default Page
