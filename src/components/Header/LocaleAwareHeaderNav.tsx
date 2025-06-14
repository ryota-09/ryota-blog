import ExternalLink from "@/components/UiParts/ExternalLink";
import Tooltip from "@/components/UiParts/Tooltip";
import type { HeaderNavItem } from "@/types/header";
import { Link } from 'next-view-transitions';

type HeaderNavProps = {
  items: HeaderNavItem[];
  locale?: string;
}

const LocaleAwareHeaderNav = ({ items, locale }: HeaderNavProps) => {
  return (
    <nav className="hidden md:block">
      <ul className="flex space-x-8 my-4 mx-1">
        {items.map(({ name, href, target }, index) => (
          target
            ?
            <li key={index} className=" text-gray-600 dark:text-gray-400 transition duration-200 hover:text-base-color hover:underline hover:underline-offset-2 hover:decoration-base-color">
              <Tooltip label={new URL(href).host} className="absolute -top-7 rounded p-1 text-white text-xs md:min-w-max min-w-[80vw] bg-gray-600 before:border-t-gray-600" >
                <ExternalLink href={href} target={target}>
                  {name}
                </ExternalLink>
              </Tooltip>
            </li>
            :
            <li key={index} className=" text-gray-600 dark:text-gray-400 transition duration-200 hover:text-base-color hover:underline hover:underline-offset-2 hover:decoration-base-color">
              <Link href={href.startsWith('/') && locale ? `/${locale}${href}` : href}>
                {name}
              </Link>
            </li>
        ))}
      </ul>
    </nav>
  );
}
export default LocaleAwareHeaderNav;