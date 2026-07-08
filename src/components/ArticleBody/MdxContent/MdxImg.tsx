import { type ComponentProps } from "react";

import CustomImg from "@/components/ArticleBody/RichEditor/CustomUI/CustomImg";
import PopupModal from "@/components/UiParts/PopupModal";

type MdxImgProps = Omit<ComponentProps<"img">, "width" | "height" | "src"> & {
  src?: string;
  width?: string | number;
  height?: string | number;
};

// velite/rehype-image-size.ts がwidth/height属性を注入済みの前提で描画する。
// 何らかの理由で注入できなかった画像(ソース解決失敗等)はwidth/height無しのフォールバックとして
// 素のimgタグで描画する(現行のReplaceUiParts.lib.tsxのimgケースと同じフォールバック方針)。
//
// NOTE(現行との意図的な差異): 現行は「親要素がaタグの場合はPopupModalでラップしない」という
// 判定を行っていたが、MDXのcomponentsマップはimg単体では親要素を判定できない。
// 変換済みMDX内でリンク内画像を使っている実例(release-notes-202407)のリンク先はダミーURLで
// 実質的にリンクとして機能していないため、影響は軽微と判断し常時PopupModalでラップする。
// MDXコンパイル済み本文中の画像パスは、日本語ファイル名がURLエンコード済み文字列
// (/static/%E3%82%B9...)で埋まっており、そのままnext/imageへ渡すと二重エンコード
// (%25E3...)される。サムネイル側(未エンコードのVelite生パス)と同一画像でもURLが
// 分裂して重複ダウンロード・キャッシュ分断が起きるため、一度デコードして正規化する
const normalizeSrc = (src: string): string => {
  try {
    return decodeURIComponent(src);
  } catch {
    // 不正なエスケープシーケンスを含む場合はそのまま使う
    return src;
  }
};

const MdxImg = ({ src, alt, width, height, ...restProps }: MdxImgProps) => {
  if (!src || !width || !height) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src ? normalizeSrc(src) : src} alt={alt ?? ""} {...restProps} />;
  }

  return (
    <PopupModal>
      <CustomImg
        {...restProps}
        src={normalizeSrc(src)}
        alt={alt ?? ""}
        width={String(width)}
        height={String(height)}
      />
    </PopupModal>
  );
};

export default MdxImg;
