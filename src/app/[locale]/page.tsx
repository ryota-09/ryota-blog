import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  robots: "noindex"
}

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale } = await params;
  redirect(`/${locale}/blogs`)
}
export default Page