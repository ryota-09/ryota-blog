"use client"
import { customReplaceOptions } from "@/components/ArticleBody/RichEditor/ReplaceUiParts.lib";
import parser from "html-react-parser";

type HTMLAreaProps = {
  html: string;
}

const HTMLArea = ({ html }: HTMLAreaProps) => {
  return (
    <aside className="flex justify-center my-8">{parser(html, customReplaceOptions)}</aside>
  )
}
export default HTMLArea;