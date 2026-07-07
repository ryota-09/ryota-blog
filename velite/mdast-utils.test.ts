// computeHeadingIds / extractToc のユニットテスト。
// 「新規記事(headingIds無し)のTOC idが全てnullになり目次が空表示になる」バグ(2026-07-07修正)の回帰防止。
// id形式は移行記事(microCMS自動生成id)互換の h+16進10桁(例: hba7e17d1c0)。
import { describe, expect, it } from "vitest";

import { computeHeadingIds, extractToc } from "./mdast-utils";

const ID_FORMAT = /^h[0-9a-f]{10}$/;

describe("computeHeadingIds", () => {
  it("見出しごとにmicroCMS互換形式(h+16進10桁)のidを文書順に生成する", () => {
    const raw = "## 何をしたのか\n\n本文\n\n## なぜ脱CMSしたのか\n\n### 補足\n";
    const ids = computeHeadingIds(raw);
    expect(ids).toHaveLength(3);
    ids.forEach((id) => expect(id).toMatch(ID_FORMAT));
  });

  it("同じ本文からは常に同じidを生成する(ビルド決定性)", () => {
    const raw = "## 何をしたのか\n\n## 最後に\n";
    expect(computeHeadingIds(raw)).toEqual(computeHeadingIds(raw));
  });

  it("同名見出しにも互いに異なるidを割り当てる", () => {
    const raw = "## まとめ\n\n## まとめ\n\n## まとめ\n";
    const ids = computeHeadingIds(raw);
    expect(new Set(ids).size).toBe(3);
    ids.forEach((id) => expect(id).toMatch(ID_FORMAT));
  });

  it("見出しテキストが同じなら記事内の位置が変わってもidは変わらない", () => {
    const [summaryIdA] = computeHeadingIds("## まとめ\n");
    const ids = computeHeadingIds("## はじめに\n\n## まとめ\n");
    expect(ids[1]).toBe(summaryIdA);
  });

  it("コードブロック内の ## は見出しとして数えない", () => {
    const raw = "## 実装\n\n```bash\n## これはコメント\n```\n";
    expect(computeHeadingIds(raw)).toHaveLength(1);
  });

  it("インラインコード混じりの見出しでもidを生成できる", () => {
    const raw = "## `min-w-0` の明示で根治\n";
    const ids = computeHeadingIds(raw);
    expect(ids).toHaveLength(1);
    expect(ids[0]).toMatch(ID_FORMAT);
  });
});

describe("extractToc", () => {
  const raw = "## 何をしたのか\n\n## 最後に\n";

  it("headingIdsが空の新規記事では自動生成idを割り当てる(nullにしない)", () => {
    const toc = extractToc(raw, []);
    expect(toc.map((entry) => entry.text)).toEqual(["何をしたのか", "最後に"]);
    expect(toc.map((entry) => entry.id)).toEqual(computeHeadingIds(raw));
    toc.forEach((entry) => expect(entry.id).toMatch(ID_FORMAT));
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
