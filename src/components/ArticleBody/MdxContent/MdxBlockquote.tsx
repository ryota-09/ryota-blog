import { type ComponentProps } from "react";

type MdxBlockquoteProps = ComponentProps<"blockquote">;

// 現行(html-react-parser版)の customReplaceOptions は、blockquote直下のpタグにだけ
// style={{ color: "#718096" }} を個別に適用していた。
// MDXのcomponentsマップでは p コンポーネント単体から「親がblockquoteかどうか」を
// 判定できない(親要素の情報が渡らない)ため、CSSの子孫セレクタ([&_p]:...)で同等の見た目を再現する。
// #718096 は Tailwind の gray-500 相当の色。
const MdxBlockquote = ({ children, ...restProps }: MdxBlockquoteProps) => {
  return (
    <blockquote
      {...restProps}
      className="border-l-4 border-gray-200 pl-2 py-1 my-2 break-all [&_p]:text-[#718096]"
    >
      {children}
    </blockquote>
  );
};

export default MdxBlockquote;
