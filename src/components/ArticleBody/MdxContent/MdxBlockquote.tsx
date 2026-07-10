import { type ComponentProps } from "react";

type MdxBlockquoteProps = ComponentProps<"blockquote">;

// MDXのcomponentsマップでは p コンポーネント単体から「親がblockquoteかどうか」を
// 判定できない(親要素の情報が渡らない)ため、CSSの子孫セレクタ([&_p]:...)で引用らしい
// グレーの文字色を当てる。
// 旧実装由来の #718096 は白背景で4.02:1とWCAG AA(4.5:1)未達だったため、
// 近い色相のgray-500(4.83:1)に変更。ダーク側はgray-400(黒背景で8.27:1)。
const MdxBlockquote = ({ children, ...restProps }: MdxBlockquoteProps) => {
  return (
    <blockquote
      {...restProps}
      className="border-l-4 border-gray-200 pl-2 py-1 my-2 break-all [&_p]:text-gray-500 dark:[&_p]:text-gray-400"
    >
      {children}
    </blockquote>
  );
};

export default MdxBlockquote;
