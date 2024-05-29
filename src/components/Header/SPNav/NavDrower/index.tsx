"use client"
import SocialMediaNav from "@/components/Header/SocialMediaNav";
import ExternalLink from "@/components/UiParts/ExternalLink";
import { HeaderNavItem } from "@/types/header";
import { Link } from 'next-view-transitions';

type NavDrowerProps = {
  isOpen: boolean;
  items: HeaderNavItem[];
  onClick: () => void;
}

const NavDrower = ({ isOpen, items, onClick }: NavDrowerProps) => {
  return (
    <>
      <div className={`bg-white dark:bg-black text-txt-base w-64 space-y-6 py-16 z-30 fixed inset-y-0 right-0 transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-500 ease-in-out`}>
        <nav>
          {items.map(({ name, href, target }, index) => (
            target
              ?
              <ExternalLink key={index} href={href} target={target} className="block py-2.5 px-0 transition dark:text-gray-300 duration-200 hover:bg-light dark:hover:bg-primary hover:text-white">
                <span className="mx-4">{name}</span>
              </ExternalLink>
              :
              <Link key={index} href={href} className="block py-2.5 px-0 transition dark:text-gray-300 duration-200 hover:bg-light dark:hover:bg-primary hover:text-white">
                <span className="mx-4">{name}</span>
              </Link>
          ))}
        </nav>
        <div className="flex justify-center px-2">
          <SocialMediaNav />
        </div>
      </div>

      {isOpen && <div className="bg-black dark:bg-gray-600 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-10" onClick={onClick}></div>}
    </>
  )
}

export default NavDrower;