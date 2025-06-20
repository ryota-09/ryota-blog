import type { Metadata } from "next";
import NotFoundContent from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: "ページが見つかりません"
};

const Page = () => {
  return <NotFoundContent />;
}
export default Page