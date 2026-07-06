import { isValidElement, type ComponentProps } from "react";

import MultiCodeBlock from "@/components/ArticleBody/RichEditor/Code/MultiCodeBlock";

type MdxPreProps = ComponentProps<"pre">;

type CodeElementProps = {
  className?: string;
  children?: string;
  "data-meta"?: string;
};

// fenced code(```lang title="filename"```)のdata-metaから title="..." の値を取り出す。
// velite/rehype-code-meta.ts がcode要素の properties["data-meta"] にmeta文字列をコピー済みの前提。
const extractFilename = (meta: string | undefined): string | null => {
  if (!meta) return null;
  const match = meta.match(/title="([^"]*)"/);
  return match ? match[1] : null;
};

// MDXの pre > code 構造をMultiCodeBlock(既存のシンタックスハイライトコンポーネント)へ橋渡しする。
// 現行(ReplaceUiParts.lib.tsxのpreケース)と同じくlanguage-xクラスからlangを、
// data-filename(旧)相当のtitle="..."からfilenameを抽出する。
const MdxPre = ({ children, ...restProps }: MdxPreProps) => {
  const codeElement = isValidElement<CodeElementProps>(children) ? children : null;

  if (!codeElement) {
    return <pre {...restProps}>{children}</pre>;
  }

  const codeProps = codeElement.props;
  const className = codeProps.className ?? "";
  const langMatch = className.match(/language-(\S+)/);
  const lang = langMatch ? langMatch[1] : "";
  const filename = extractFilename(codeProps["data-meta"]);

  return (
    <MultiCodeBlock filename={filename} lang={lang}>
      {codeProps.children ?? ""}
    </MultiCodeBlock>
  );
};

export default MdxPre;
