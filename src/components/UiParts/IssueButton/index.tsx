import ExternalLink from "@/components/UiParts/ExternalLink";
import Image from "next/image";

type IssueButtonProps = {
  currentPath: string;
}

const IssueButton = ({ currentPath }: IssueButtonProps) => {
  const bodyText = `対象ページ: ${currentPath}\n\n■修正箇所\n\n■修正の理由\n\n■改善提案\n\n■その他\n`;
  const encodedBodyText = encodeURIComponent(bodyText);
  const href = `https://github.com/ryota-09/ryota-blog/issues/new?body=${encodedBodyText}`;
  return (
    <ExternalLink href={href} className="flex gap-4 items-center hover:opacity-70 dark:bg-gray-500 w-full sm:w-1/2  lg:w-1/4 border shadow-md p-4">
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