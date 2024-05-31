"use client"
import { type ComponentProps, useState } from "react";
import { usePathname } from "next/navigation";
import { baseURL } from "@/config";
import { cltw } from "@/util";

type CustomH3Props = ComponentProps<"h3">


const CustomH3 = ({ children, id, ...RestProps }: CustomH3Props) => {
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
    <div className="inline-block relative group cursor-pointer my-3" onClick={handleCopy}>
      <h3 id={id} {...RestProps} className="text-xl dark:text-gray-300 font-bold group-hover:text-base-color transition duration-300 ease-in-out z-20 pr-1">
        {children}
      </h3>
      {/* NOTE: コピー後の表示 */}
      <p className={cltw("text-xs content-center px-2 py-0.5 rounded bg-base-color dark:bg-secondary translate-x-full duration-300 absolute right-0 top-[5px] text-white", isClicked ? "inline-block" : "hidden")}>Copied !</p>
      <i className={cltw("text-xl absolute right-0 top-0 opacity-0 group-hover:opacity-100 z-10 transition group-hover:translate-x-full duration-300 group-hover:text-base-color", isClicked ? "hidden" : "inline")}>#</i>
    </div>
  );
};

export default CustomH3;