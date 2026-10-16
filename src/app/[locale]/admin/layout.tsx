import type { Metadata } from "next";

import { assertAdminAuthorized } from "@/lib/admin-guard";

// 管理者専用ページのため検索エンジンにインデックスさせない
export const metadata: Metadata = {
  robots: "noindex",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // middlewareのパス判定をすり抜けた場合に備え、描画前にサーバー側でも認可を検証する(二重防御)
  await assertAdminAuthorized();
  return <>{children}</>;
}
