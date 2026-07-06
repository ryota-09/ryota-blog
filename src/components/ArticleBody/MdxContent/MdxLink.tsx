import { type ComponentProps } from "react";

import CustomLink from "@/components/ArticleBody/RichEditor/CustomUI/CustomLink";
import ExternalLink from "@/components/UiParts/ExternalLink";

type MdxLinkProps = ComponentProps<"a">;

// 現行(ReplaceUiParts.lib.tsxのaケース)と同じ内部/外部判定ロジックをそのまま踏襲する:
// httpで始まる、またはtarget=_blank、またはURLにamazonを含む場合は外部リンク扱い。
const MdxLink = ({ href, children, ...restProps }: MdxLinkProps) => {
  const resolvedHref = href ?? "";
  const isExternal =
    resolvedHref.startsWith("http") ||
    restProps.target === "_blank" ||
    resolvedHref.includes("amazon");

  if (isExternal) {
    return (
      <ExternalLink
        {...restProps}
        href={resolvedHref}
        className="underline underline-offset-4 transition hover:text-base-color dark:hover:text-primary hover:no-underline break-all"
      >
        {children}
      </ExternalLink>
    );
  }

  return (
    <CustomLink {...restProps} href={resolvedHref}>
      {children}
    </CustomLink>
  );
};

export default MdxLink;
