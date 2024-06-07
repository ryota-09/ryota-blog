import ExternalLink from "@/components/UiParts/ExternalLink";
import Image from "next/image";

type IssueButtonProps = {
  currentPath: string;
}

const IssueButton = ({ currentPath }: IssueButtonProps) => {
  const href = `https://github.com/ryota-09/ryota-blog/issues/new?template=issue_template.md&body=対象ページ:+${currentPath}`
  return (
    <ExternalLink href={href} className="flex gap-4 items-center hover:opacity-70 dark:bg-gray-500 w-[70%] md:w-1/3  lg:w-1/4 border shadow-md p-4">
      <figure>
        <Image src="/icons/github.svg" alt="GitHub" width={24} height={24} />
      </figure>
      <div className=" text-txt-base dark:text-gray-400 text-center flex-grow">
        修正をリクエストする
      </div>
    </ExternalLink>
  )
}
export default IssueButton;