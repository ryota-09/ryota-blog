"use client"

import HumbergerButton from "@/components/Header/SPNav/HumbergerButton";
import NavDrower from "@/components/Header/SPNav/NavDrower";
import { HEADER_NAV_ITEMS } from "@/static/header";
import { useState } from "react";

const SPNav = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <div className="text-gray-100 flex justify-between md:hidden">
        <HumbergerButton isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
      </div>
      <NavDrower isOpen={isOpen} items={HEADER_NAV_ITEMS} onClick={() => setIsOpen((prev) => !prev)} />
    </>
  );
}

export default SPNav;