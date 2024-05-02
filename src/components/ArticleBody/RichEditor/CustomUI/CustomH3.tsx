"use client"
import { baseURL } from "@/config";
import { cltw } from "@/util";
import { usePathname } from "next/navigation";
import { useState, type HTMLAttributes } from "react";

type CustomH3Props = HTMLAttributes<HTMLHeadingElement>


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
    <div className="inline-block relative group cursor-pointer" onClick={handleCopy}>
      <h3 id={id} {...RestProps} className="text-xl font-bold group-hover:text-base-color transition duration-300 ease-in-out z-20 pr-1">
        {children}
      </h3>
      {/* NOTE: コピー後の表示 */}
      {/* <p className={cltw("text-xs content-center rounded bg-base-color group-hover:translate-x-full absolute right-0 top-0 text-white", isClicked ? "inline" : "hidden")}>✅</p> */}
      <i className={cltw("text-xl absolute right-0 top-0 opacity-0 group-hover:opacity-100 z-10 transition group-hover:translate-x-full duration-300 group-hover:text-base-color", isClicked ? "hidden" : "inline")}>#</i>
    </div>
  );
};

export default CustomH3;