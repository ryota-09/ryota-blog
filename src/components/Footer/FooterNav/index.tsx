import ExternalLink from "@/components/UiParts/ExternalLink";
import Tooltip from "@/components/UiParts/Tooltip";
import type { HeaderNavItem } from "@/types/header";
import { Link } from "next-view-transitions";

type FooterNavProps = {
  items: HeaderNavItem[];
  locale?: string;
};

const FooterNav = ({ items, locale }: FooterNavProps) => {
  return (
    <nav className="pb-6" role="navigation">
      <ul className="mt-4 grid grid-cols-3 md:flex md:gap-4">
        {items.map(({ name, href, target }, index) =>
          target ? (
            <li
              key={index}
              className="flex min-w-20 justify-center text-gray-600 dark:text-gray-400 md:text-start"
            >
              <Tooltip
                label={new URL(href).host}
                className="min-w-auto absolute -top-7 rounded bg-gray-600 p-1 text-xs text-white before:border-t-gray-600 md:min-w-max"
              >
                <ExternalLink
                  href={href}
                  target={target}
                  className="block px-2 py-3 transition duration-200 hover:text-base-color hover:underline hover:decoration-base-color hover:underline-offset-2"
                >
                  {name}
                </ExternalLink>
              </Tooltip>
            </li>
          ) : (
            <li
              key={index}
              className="flex min-w-20 justify-center text-gray-600 dark:text-gray-400 md:text-start"
            >
              <Link
                href={
                  href.startsWith("/") && locale ? `/${locale}${href}` : href
                }
                prefetch={false}
                className="block px-2 py-3 transition duration-200 hover:text-base-color hover:underline hover:decoration-base-color hover:underline-offset-2"
              >
                {name}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
};
export default FooterNav;
