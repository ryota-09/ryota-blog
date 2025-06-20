import { Link } from 'next-view-transitions';
import { SITE_TITLE } from "@/static/blogs";

interface ErrorPageHeaderProps {
  locale: string;
}

const ErrorPageHeader = ({ locale }: ErrorPageHeaderProps) => {
  return (
    <header className="bg-white dark:bg-black pt-4 shadow-md">
      <div className="container mx-auto px-2 md:px-0">
        <div className="flex justify-between items-center mb-4">
          <div className="flex justify-between w-full">
            <Link href={`/${locale}/blogs`} className="text-2xl font-bold text-gray-800 dark:text-gray-200 hover:text-base-color transition duration-200">
              {SITE_TITLE}
            </Link>
          </div>
        </div>
        <nav className="py-4">
          <ul className="flex space-x-6">
            <li>
              <Link href={`/${locale}/blogs`} className="text-gray-600 dark:text-gray-300 hover:text-base-color transition duration-200">
                {locale === 'en' ? 'Blog' : 'ブログ'}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/about`} className="text-gray-600 dark:text-gray-300 hover:text-base-color transition duration-200">
                {locale === 'en' ? 'About' : 'プロフィール'}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default ErrorPageHeader;