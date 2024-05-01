"use client"

import HumbergerButton from "@/components/Header/SPNav/HumbergerButton";
import NavDrower from "@/components/Header/SPNav/NavDrower";
import { useState } from "react";

const SPNav = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <HumbergerButton isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
      {/* {isOpen && ( */}
      <NavDrower isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
      {/* )} */}
    </>
  );
}

export default SPNav;