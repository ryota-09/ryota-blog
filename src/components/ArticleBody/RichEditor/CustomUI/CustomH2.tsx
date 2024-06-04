"use client"
import { type ComponentProps, useState } from "react";

import { baseURL } from "@/config";
import { cltw } from "@/util";
import { usePathname } from "next/navigation";

type CustomH2Props = ComponentProps<"h2">


const CustomH2 = ({ children, id, ...RestProps }: CustomH2Props) => {
  const pathname = usePathname()
  const [isClicked, setIsClicked] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${baseURL}${pathname}#${id}`);
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 1000);
  };

  return (
    <div className="py-3 my-3 border-b-secondary border-b-2 group cursor-pointer" onClick={handleCopy}>
      <div className="inline-block relative">
        <h2 id={id} {...RestProps} className="text-2xl dark:text-gray-300 font-bold group-hover:text-base-color transition duration-300 ease-in-out z-20 pr-1">
          {children}
        </h2>
        {/* NOTE: コピー後の表示 */}
        <p className={cltw("text-xs content-center px-2 py-1 rounded bg-base-color dark:bg-secondary translate-x-full duration-300 absolute -top-[1.5rem] right-14 md:right-0 md:top-[5px] text-white", isClicked ? "inline-block" : "hidden")}>Copied !</p>
        <i className={cltw("text-2xl absolute right-0 top-0 opacity-0 group-hover:opacity-100 z-10 transition group-hover:translate-x-full duration-300 group-hover:text-base-color", isClicked ? "hidden" : "inline")}>#</i>
      </div>
    </div>
  );
};

export default CustomH2;