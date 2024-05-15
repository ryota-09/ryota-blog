"use client"
import { Link as Scroll } from "react-scroll"
import type { ReactNode } from "react";

import { cltw } from "@/util";

type TOCItemProps = {
  id: string;
  children: ReactNode;
  classes?: string;
}

const TOCItem = ({ id, children, classes }: TOCItemProps) => {
  return (
    <Scroll
      to={id}
      smooth
      offset={-14}
      className={cltw("cursor-pointer",classes)}
    >
      {children}
    </Scroll>
  )
}
export default TOCItem