import ImageWithLoader from "@/components/UiParts/ImageWithLoader"
import Image from "next/image"
import Link from "next/link"

const Page = () => {
  return (
    <div className="mx-auto">
      <ImageWithLoader src="/404.webp" alt="404" width={400} height={400} classes="rounded-3xl" />
      <Link href="/">トップページへ戻る</Link>
    </div>
  )
}
export default Page