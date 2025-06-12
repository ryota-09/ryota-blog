import { redirect } from "next/navigation"

const Page = () => {
  // Root page will be handled by middleware to redirect to default locale
  redirect("/ja")
}
export default Page