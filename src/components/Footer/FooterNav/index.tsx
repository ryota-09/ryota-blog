import ExternalLink from "@/components/UiParts/ExternalLink";
import type { HeaderNavItem } from "@/types/header";
import { Link } from 'next-view-transitions';

type FooterNavProps = {
  items: HeaderNavItem[];
}

const FooterNav = ({ items }: FooterNavProps) => {
  return (
    <nav>
      <ul className="flex space-x-8 mt-4">
        {items.map(({ name, href, target }, index) => (
          target
            ?
            <li key={index} className=" text-gray-600 dark:text-gray-400 transition duration-200 hover:text-base-color hover:underline hover:underline-offset-2 hover:decoration-base-color">
              <ExternalLink href={href} target={target}>
                {name}
              </ExternalLink>
            </li>
            :
            <li key={index} className=" text-gray-600 dark:text-gray-400 transition duration-200 hover:text-base-color hover:underline hover:underline-offset-2 hover:decoration-base-color">
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