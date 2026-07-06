import * as runtime from "react/jsx-runtime";

import type { BlogPost } from "@/types/content";

import { makeMdxComponents } from "./makeMdxComponents";

type MdxContentProps = {
  blog: BlogPost;
};

// キャッシュ: 同一のbody文字列を毎回 `new Function` で評価し直すのは無駄なコストがかかるため、
// コンパイル結果(関数)をモジュールスコープでキャッシュする。
// (bodyはビルド時に確定する文字列であり、同一プロセス内で内容が変わることはない)
const compiledFunctionCache = new Map<string, (arg: unknown) => { default: React.ComponentType<Record<string, unknown>> }>();

const getMdxModule = (body: string) => {
  const cached = compiledFunctionCache.get(body);
  if (cached) return cached;

  // Velite公式のfunction-body評価方式。s.mdx()の出力(outputFormat: "function-body")は
  // 関数本体の文字列であり、new Functionで実行可能な関数へ変換したうえでjsx-runtimeを渡して呼び出す。
  const fn = new Function(body) as (arg: unknown) => {
    default: React.ComponentType<Record<string, unknown>>;
  };
  compiledFunctionCache.set(body, fn);
  return fn;
};

// Veliteが生成したMDX(function-body文字列)を評価してレンダリングするコンポーネント。
// components マップは ReplaceUiParts.lib.tsx (旧HTML→React変換)のマッピングをMDX向けに
// 再現したもの(makeMdxComponents.tsx参照)。すべてビルド時に確定したbody文字列を評価するだけで、
// ネットワークアクセスやNode.js固有API(fs等)には依存しないためCloudflare Workers上でも動作する。
const MdxContent = ({ blog }: MdxContentProps) => {
  const mdxModule = getMdxModule(blog.body)({ ...runtime, Fragment: runtime.Fragment });
  const Content = mdxModule.default;
  const components = makeMdxComponents(blog);

  return <Content components={components} />;
};

export default MdxContent;
