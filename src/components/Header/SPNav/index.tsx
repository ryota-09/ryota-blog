"use client"
import dynamic from "next/dynamic";

import HumbergerButton from "@/components/Header/SPNav/HumbergerButton";
import { HEADER_NAV_ITEMS } from "@/static/header";
import { useState } from "react";

const NavDrower = dynamic(() => import("@/components/Header/SPNav/NavDrower"));

interface SPNavProps {
  locale?: string;
}

const SPNav = ({ locale }: SPNavProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <div className=" flex justify-between md:hidden">
        <HumbergerButton isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
      </div>
      <NavDrower isOpen={isOpen} items={HEADER_NAV_ITEMS} locale={locale} onClick={() => setIsOpen((prev) => !prev)} />
    </>
  );
}

export default SPNav;