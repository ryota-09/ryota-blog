// computeHeadingSlugs / extractToc のユニットテスト。
// 「新規記事(headingIds無し)のTOC idが全てnullになり目次が空表示になる」バグ(2026-07-07修正)の回帰防止。
import { describe, expect, it } from "vitest";

import { computeHeadingSlugs, extractToc } from "./mdast-utils";

describe("computeHeadingSlugs", () => {
  it("日本語見出しから文書順にスラッグを生成する", () => {
    const raw = "## 何をしたのか\n\n本文\n\n## なぜ脱CMSしたのか\n\n### 補足\n";
    expect(computeHeadingSlugs(raw)).toEqual(["何をしたのか", "なぜ脱cmsしたのか", "補足"]);
  });

  it("同名見出しの重複は -1, -2 で回避する", () => {
    const raw = "## まとめ\n\n## まとめ\n\n## まとめ\n";
    expect(computeHeadingSlugs(raw)).toEqual(["まとめ", "まとめ-1", "まとめ-2"]);
  });

  it("コードブロック内の ## は見出しとして数えない", () => {
    const raw = "## 実装\n\n```bash\n## これはコメント\n```\n";
    expect(computeHeadingSlugs(raw)).toEqual(["実装"]);
  });

  it("インラインコード混じりの見出しも文書順のテキストでスラッグ化する", () => {
    const raw = "## `min-w-0` の明示で根治\n";
    expect(computeHeadingSlugs(raw)).toEqual(["min-w-0-の明示で根治"]);
  });
});

describe("extractToc", () => {
  const raw = "## 何をしたのか\n\n## 最後に\n";

  it("headingIdsが空の新規記事では自動生成idを割り当てる(nullにしない)", () => {
    const toc = extractToc(raw, []);
    expect(toc).toEqual([
      { depth: 2, text: "何をしたのか", id: "何をしたのか" },
      { depth: 2, text: "最後に", id: "最後に" },
    ]);
  });

  it("headingIdsがある移行記事ではそれをそのまま使う(従来挙動を維持)", () => {
    const toc = extractToc(raw, ["hba7e17d1c0", "h9036816da0"]);
    expect(toc.map((entry) => entry.id)).toEqual(["hba7e17d1c0", "h9036816da0"]);
  });

  it("headingIdsが見出し数より短い移行記事では末尾がnullになる(従来挙動を維持)", () => {
    const toc = extractToc(raw, ["hba7e17d1c0"]);
    expect(toc.map((entry) => entry.id)).toEqual(["hba7e17d1c0", null]);
  });
});
