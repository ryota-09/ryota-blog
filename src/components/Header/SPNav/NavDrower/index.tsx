"use client";
import { Link } from "next-view-transitions";

import SocialMediaNav from "@/components/Header/SocialMediaNav";
import ExternalLink from "@/components/UiParts/ExternalLink";
import type { HeaderNavItem } from "@/types/header";

type NavDrowerProps = {
  isOpen: boolean;
  items: HeaderNavItem[];
  locale?: string;
  onClick: () => void;
};

const NavDrower = ({ isOpen, items, locale, onClick }: NavDrowerProps) => {
  return (
    <>
      <div
        className={`fixed inset-y-0 right-0 z-30 w-64 transform space-y-6 bg-white py-16 text-txt-base dark:bg-black ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-500 ease-in-out`}
      >
        <nav role="navigation">
          {items.map(({ name, href, target }, index) =>
            target ? (
              <ExternalLink
                key={index}
                href={href}
                target={target}
                className="block px-0 py-2.5 transition duration-200 hover:bg-light hover:text-white dark:text-gray-300 dark:hover:bg-primary"
              >
                <span className="mx-4">{name}</span>
              </ExternalLink>
            ) : (
              <Link
                key={index}
                href={
                  href.startsWith("/") && locale ? `/${locale}${href}` : href
                }
                className="block px-0 py-2.5 transition duration-200 hover:bg-light hover:text-white dark:text-gray-300 dark:hover:bg-primary"
              >
                <span className="mx-4">{name}</span>
              </Link>
            ),
          )}
        </nav>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex justify-center">
            <SocialMediaNav locale={locale} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 backdrop-blur-md dark:bg-gray-600 dark:bg-opacity-80"
          onClick={onClick}
        ></div>
      )}
    </>
  );
};

export default NavDrower;
