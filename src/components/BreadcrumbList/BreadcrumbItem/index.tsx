import Link from "next/link";

type BreadcrumbItemProps = {
  href: string;
  label: string;
  isLast?: boolean;
}

const BreadcrumbItem = ({ href, label, isLast }: BreadcrumbItemProps) => {
  return (
    <li className="inline-flex items-center gap-1.5">
      {!isLast
        ?
        <>
          <Link href={href} className="text-gray-600 h-wull w-full transition duration-200 hover:text-base-color hover:underline hover:underline-offset-2 hover:decoration-base-color">
            <span>{label}</span>
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-right"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </>
        :
        <p className="text-gray-600">{label}</p>
      }

    </li >
  )
}
export default BreadcrumbItem;