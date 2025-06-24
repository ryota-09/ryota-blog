import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  robots: "noindex"
}

interface PageProps {
  params: {
    locale: string;
  };
}

const Page = ({ params: { locale } }: PageProps) => {
  setRequestLocale(locale);
  redirect(`/${locale}/blogs`)
}
export default Page