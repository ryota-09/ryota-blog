import { Link } from "next-view-transitions";
import { SITE_TITLE } from "@/static/blogs";

interface ErrorPageHeaderProps {
  locale: string;
}

const ErrorPageHeader = ({ locale }: ErrorPageHeaderProps) => {
  return (
    <header className="bg-white pt-4 shadow-md dark:bg-black">
      <div className="container mx-auto px-2 md:px-0">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex w-full justify-between">
            <Link
              href={`/${locale}/blogs`}
              className="text-2xl font-bold text-gray-800 transition duration-200 hover:text-base-color dark:text-gray-200"
            >
              {SITE_TITLE}
            </Link>
          </div>
        </div>
        <nav className="py-4" role="navigation">
          <ul className="flex space-x-6">
            <li>
              <Link
                href={`/${locale}/blogs`}
                className="text-gray-600 transition duration-200 hover:text-base-color dark:text-gray-300"
              >
                {locale === "en" ? "Blog" : "ブログ"}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/about`}
                className="text-gray-600 transition duration-200 hover:text-base-color dark:text-gray-300"
              >
                {locale === "en" ? "About" : "プロフィール"}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default ErrorPageHeader;
