import ExternalLink from "@/components/UiParts/ExternalLink";
import Tooltip from "@/components/UiParts/Tooltip";
import type { HeaderNavItem } from "@/types/header";
import { Link } from 'next-view-transitions';

type FooterNavProps = {
  items: HeaderNavItem[];
}

const FooterNav = ({ items }: FooterNavProps) => {
  return (
    <nav className="pb-6">
      <ul className="md:flex md:gap-4 grid grid-cols-3 mt-4">
        {items.map(({ name, href, target }, index) => (
          target
            ?
            <li key={index} className="min-w-20 flex justify-center md:text-start text-gray-600 dark:text-gray-400">
              <Tooltip label={new URL(href).host} className="absolute -top-7 rounded p-1 text-white text-xs min-w-auto md:min-w-max bg-gray-600 before:border-t-gray-600" >
                <ExternalLink href={href} target={target} className="block px-2 py-3 transition duration-200 hover:text-base-color hover:underline hover:underline-offset-2 hover:decoration-base-color">
                  {name}
                </ExternalLink>
              </Tooltip>
            </li>
            :
            <li key={index} className="min-w-20 flex justify-center md:text-start text-gray-600 dark:text-gray-400">
              <Link href={href} prefetch={false} className="block px-2 py-3 transition duration-200 hover:text-base-color hover:underline hover:underline-offset-2 hover:decoration-base-color">
                {name}
              </Link>
            </li>
        ))}
      </ul>
    </nav>
  );
}
export default FooterNav;