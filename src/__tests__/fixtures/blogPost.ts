// テスト用のBlogPostフィクスチャ。
// 旧実装では外部CMSのレスポンス形状をmswでモックしていたが、データ層が
// Velite(src/lib/content.ts)に移行したため、コンポーネント単体テストで使う
// 最小限のBlogPostオブジェクトを直接エクスポートする形に置き換えた(#241)。
// 実データを使った検証は src/lib/__tests__/content.spec.ts (.velite出力を直接参照) を参照。
import type { BlogPost } from "@/types/content";

export const mockedBlogPost: BlogPost = {
  slug: "example1",
  locale: "ja",
  title: "example title 1",
  description: "example description 1",
  publishedAt: "2022-05-22T00:00:00.000Z",
  updatedAt: "2024-05-31T04:13:26.975Z",
  categories: ["exampleCategory1"],
  thumbnail: undefined,
  noIndex: false,
  isAdvertisement: true,
  related: [],
  headingIds: ["example"],
  moshimoWidgets: [],
  body: "<h2 id=\"example\">example heading</h2><p>example paragraph.</p>",
  raw: "## example heading\n\nexample paragraph.",
  toc: [
    { depth: 2, text: "example heading", id: "example" },
  ],
  plainText: "example heading example paragraph.",
};

export const mockedBlogPostWithThumbnail: BlogPost = {
  slug: "example2",
  locale: "ja",
  title: "example title 2",
  description: "test description 2",
  publishedAt: "2022-09-11T00:00:00.000Z",
  updatedAt: "2024-06-04T08:33:34.665Z",
  categories: ["exampleCategory2", "testCategory"],
  thumbnail: {
    src: "https://example.com/thumbnail.jpg",
    height: 1080,
    width: 1920,
    blurDataURL: "",
    blurWidth: 8,
    blurHeight: 8,
  },
  noIndex: false,
  isAdvertisement: true,
  related: ["example1"],
  headingIds: ["test"],
  moshimoWidgets: [],
  body: "<p>Hello! This is a test article.</p><h2 id=\"test\">Test Heading</h2><p>Test paragraph.</p>",
  raw: "Hello! This is a test article.\n\n## Test Heading\n\nTest paragraph.",
  toc: [
    { depth: 2, text: "Test Heading", id: "test" },
  ],
  plainText: "Hello! This is a test article. Test Heading Test paragraph.",
};

export const mockedBlogPostList: BlogPost[] = [mockedBlogPost, mockedBlogPostWithThumbnail];
