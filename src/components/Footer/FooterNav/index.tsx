import type { HeaderNavItem } from "@/types/header";
import { Link } from 'next-view-transitions';

type FooterNavProps = {
  items: HeaderNavItem[];
}

const FooterNav = ({ items }: FooterNavProps) => {
  return (
    <nav>
      <ul className="flex space-x-8 mt-4">
        {items.map(({ name, href }, index) => (
          <Link key={index} href={href}>
            <li className=" text-gray-600 transition duration-200 hover:text-base-color hover:underline hover:underline-offset-2 hover:decoration-base-color">{name}</li>
          </Link>
        ))}
      </ul>
    </nav>
  );
}
export default FooterNav;