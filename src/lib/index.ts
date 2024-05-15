import type { TOCAssetsType } from "@/types";

export const generateTOCAssets = (html: string) => {
  // 正規表現を使用して<h2>または<h3>タグのidとテキストを抽出
  const regex = /<(h2|h3) id="([^"]*)">(.*?)<\/\1>/g;

  const results: TOCAssetsType[] = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    const tag = match[1];
    const id = match[2];
    const text = match[3];

    if (tag === "h2") {
      results.push({
        id: id,
        text: text,
        subList: []
      });
    } else if (tag === "h3" && results.length > 0) {
      results[results.length - 1].subList.push({
        id: id,
        text: text
      });
    }
  }

  return results;
}