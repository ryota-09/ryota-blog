import ExternalLink from "@/components/UiParts/ExternalLink";
import Tooltip from "@/components/UiParts/Tooltip";
import type { HeaderNavItem } from "@/types/header";
import { Link } from 'next-view-transitions';

type FooterNavProps = {
  items: HeaderNavItem[];
}

const FooterNav = ({ items }: FooterNavProps) => {
  return (
    <nav className="flex items-center pb-6">
      <ul className="flex flex-grow flex-wrap justify-evenly md:justify-start gap-y-4 sm:gap-y-0 md:space-x-8 mt-4">
        {items.map(({ name, href, target }, index) => (
          target
            ?
            <li key={index} className="min-w-20 text-center md:text-start text-gray-600 dark:text-gray-400 transition duration-200 hover:text-base-color hover:underline hover:underline-offset-2 hover:decoration-base-color">
              <Tooltip label={new URL(href).host} className="absolute -top-7 rounded p-1 text-white text-xs min-w-auto md:min-w-max bg-gray-600 before:border-t-gray-600" >
                <ExternalLink href={href} target={target}>
                  {name}
                </ExternalLink>
              </Tooltip>
            </li>
            :
            <li key={index} className="min-w-20 text-center md:text-start text-gray-600 dark:text-gray-400 transition duration-200 hover:text-base-color hover:underline hover:underline-offset-2 hover:decoration-base-color">
              <Link href={href}>
                {name}
              </Link>
            </li>
        ))}
      </ul>
    </nav>
  );
}
export default FooterNav;