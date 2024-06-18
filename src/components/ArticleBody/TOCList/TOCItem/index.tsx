"use client"
import { Link as Scroll } from "react-scroll"
import type { ReactNode } from "react";

import { cltw } from "@/util";

type TOCItemProps = {
  id: string;
  children: ReactNode;
  className?: string;
}

const TOCItem = ({ id, children, className }: TOCItemProps) => {
  return (
    <Scroll
      href={`#${id}`}
      to={id}
      smooth
      offset={-14}
      className={cltw("cursor-pointer",className)}
    >
      {children}
    </Scroll>
  )
}
export default TOCItem