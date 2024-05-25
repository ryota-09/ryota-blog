import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  robots: "noindex"
}

const Page = () => {
  redirect("/blogs")
}
export default Page