import type { Metadata } from "next";

// 管理者専用ページのため検索エンジンにインデックスさせない
export const metadata: Metadata = {
  robots: "noindex",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
