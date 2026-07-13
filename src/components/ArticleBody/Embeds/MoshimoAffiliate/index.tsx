import ExecutableScript from "@/components/ArticleBody/RichEditor/ExecutableScript";
import type { MoshimoWidget } from "@/types/content";

type MoshimoAffiliateProps = {
  widget: MoshimoWidget;
};

// もしもアフィリエイト(かんたんリンク)のローダー即時関数。
// 元のmicroCMS HTMLブロック(<!-- START MoshimoAffiliateEasyLink -->)の1つ目のscriptタグと同一。
// bundle.jsの読み込み・msmaflink関数のキュー実装を行う。
const MOSHIMO_LOADER_CODE = `(function(b,c,f,g,a,d,e){b.MoshimoAffiliateObject=a;
b[a]=b[a]||function(){arguments.currentScript=c.currentScript
||c.scripts[c.scripts.length-2];(b[a].q=b[a].q||[]).push(arguments)};
c.getElementById(a)||(d=c.createElement(f),d.src=g,
d.id=a,e=c.getElementsByTagName("body")[0],e.appendChild(d))})
(window,document,"script","//dn.msmstatic.com/site/cardlink/bundle.js?20220329","msmaflink");`;

// もしもアフィリエイトウィジェット(かんたんリンク)。現行のhtmlブロック(script+div)と同等のDOMを
// MDXコンポーネントとして再構築する。scriptの実行は既存のExecutableScriptを必ず流用する
// (React経由でDOMに挿入されたscriptタグはブラウザ仕様で実行されないため。
//  ExecutableScriptはソフトナビゲーション対応の合成loadディスパッチを実装済み。f0b1eb5のリグレッション防止)。
const MoshimoAffiliate = ({ widget }: MoshimoAffiliateProps) => {
  // ウィジェットJSONのシリアライズは決定的に(JSON.stringifyはキー順を保持する)行う
  const widgetCallCode = `msmaflink(${JSON.stringify(widget)});`;
  const code = `${MOSHIMO_LOADER_CODE}\n${widgetCallCode}`;

  return (
    <aside className="my-4">
      {/* ビューポート1画面分手前まで初期化を遅延し、bundle.js+商品画像(各ウィジェット1枚目)の
          取得を初期ロードのLCP帯域から退避させる。ファーストビュー内のウィジェットは即初期化される */}
      <ExecutableScript
        attribs={{ type: "text/javascript" }}
        code={code}
        lazyRootMargin="800px 0px"
      />
      <div id={`msmaflink-${widget.eid}`}>リンク</div>
    </aside>
  );
};

export default MoshimoAffiliate;
