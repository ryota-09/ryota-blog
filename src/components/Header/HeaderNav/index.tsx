import type { HeaderNavItem } from "@/types/header";
import { Link } from 'next-view-transitions';

type HeaderNavProps = {
  items: HeaderNavItem[];
}

const HeaderNav = ({ items }: HeaderNavProps) => {
  return (
    <nav className="hidden md:block">
      <ul className="flex space-x-8 my-4 mx-1">
        {items.map(({ name, href }, index) => (
          <Link key={index} href={href}>
            <li className=" text-gray-600 dark:text-gray-400 transition duration-200 hover:text-base-color hover:underline hover:underline-offset-2 hover:decoration-base-color">{name}</li>
          </Link>
        ))}
      </ul>
    </nav>
  );
}
export default HeaderNav;