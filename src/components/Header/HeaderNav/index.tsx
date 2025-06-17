import ExternalLink from "@/components/UiParts/ExternalLink";
import Tooltip from "@/components/UiParts/Tooltip";
import type { HeaderNavItem } from "@/types/header";
import { Link } from "next-view-transitions";

type HeaderNavProps = {
  items: HeaderNavItem[];
};

const HeaderNav = ({ items }: HeaderNavProps) => {
  return (
    <nav className="hidden md:block" role="navigation">
      <ul className="mx-1 my-4 flex space-x-8">
        {items.map(({ name, href, target }, index) =>
          target ? (
            <li
              key={index}
              className="text-gray-600 transition duration-200 hover:text-base-color hover:underline hover:decoration-base-color hover:underline-offset-2 dark:text-gray-400"
            >
              <Tooltip
                label={new URL(href).host}
                className="absolute -top-7 min-w-[80vw] rounded bg-gray-600 p-1 text-xs text-white before:border-t-gray-600 md:min-w-max"
              >
                <ExternalLink href={href} target={target}>
                  {name}
                </ExternalLink>
              </Tooltip>
            </li>
          ) : (
            <li
              key={index}
              className="text-gray-600 transition duration-200 hover:text-base-color hover:underline hover:decoration-base-color hover:underline-offset-2 dark:text-gray-400"
            >
              <Link href={href}>{name}</Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
};
export default HeaderNav;
