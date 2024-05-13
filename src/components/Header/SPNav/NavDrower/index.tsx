"use client"
import CloseButton from "@/components/Header/SPNav/CloseButton";
import { HeaderNavItem } from "@/types/header";
import Link from "next/link";

type NavDrowerProps = {
  isOpen: boolean;
  items: HeaderNavItem[];
  onClick: () => void;
}

const NavDrower = ({ isOpen, items, onClick }: NavDrowerProps) => {
  return (
    <>
      <div className={`bg-white text-txt-base w-64 space-y-6 py-4 z-30 absolute inset-y-0 right-0 transform ${isOpen ? "translate-x-0" : "translate-x-full"} md:relative md:translate-x-0 transition duration-500 ease-in-out`}>
        <div className="flex justify-end px-4">
          <CloseButton onClick={onClick} />
        </div>
        <nav>
          {items.map(({ name, href }, index) => (
            <Link key={index} href={href} className="block py-2.5 px-0 transition duration-200 hover:bg-light hover:text-white">
              <span className="mx-4">{name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {isOpen && <div className="bg-black bg-opacity-50 fixed inset-0 z-10" onClick={onClick}></div>}
    </>
  )
}

export default NavDrower;