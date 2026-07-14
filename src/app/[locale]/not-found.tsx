import type { Metadata } from "next";
import NotFoundContent from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: "ページが見つかりません"
};

// [locale]配下のページ内(記事未存在等)でnotFound()が呼ばれた場合はこちらが使われる。
// [locale]/layout.tsxに包まれるため、フォント・NextIntlClientProvider等はそのまま適用される。
// [locale]セグメント自体が不正な場合(layout.tsx自身がnotFound()を呼ぶ場合)はこの境界の
// 対象外となり、上位の src/app/not-found.tsx(自前で<html>/<body>を持つ)が使われる
const Page = () => {
  return <NotFoundContent />;
}
export default Page
