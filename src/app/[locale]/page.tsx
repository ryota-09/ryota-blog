import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  robots: "noindex"
}

interface PageProps {
  params: {
    locale: string;
  };
}

const Page = ({ params: { locale } }: PageProps) => {
  redirect(`/${locale}/blogs`)
}
export default Page