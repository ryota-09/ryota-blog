import CopyableText from "@/components/ArticleBody/RichEditor/CopyableText";

// MDXの<Copyable>text</Copyable>から既存のCopyableText(コピー可能なコード風テキスト)へ橋渡しする。
// 見た目・挙動は既存コンポーネントをそのまま流用する。
const Copyable = CopyableText;

export default Copyable;
