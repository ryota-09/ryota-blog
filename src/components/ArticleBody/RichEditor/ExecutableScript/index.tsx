"use client"
import { useEffect, useRef } from "react";

type ExecutableScriptProps = {
  // 元のscriptタグの属性（src, type, async など）
  attribs: Record<string, string>;
  // 元のscriptタグのインラインコード（外部scriptの場合は空文字）
  code: string;
  // 指定時、親要素がビューポートに接近(rootMargin指定分の手前)するまでスクリプト実行を遅延する。
  // 外部リソースを大量に取得する埋め込み(もしも等)を初期ロードのLCP帯域から退避させるために使う
  lazyRootMargin?: string;
};

// もしもアフィリエイト(かんたんリンク)のローダーがbundle.jsのscript要素に付与するID
const MOSHIMO_LOADER_ID = "msmaflink";

// もしものbundle.jsはウィジェット描画処理をDOMContentLoaded/loadイベントでのみ発火するため、
// 両イベントが発火済みのソフトナビゲーション後は、loadイベントを自前で再ディスパッチして
// 描画をトリガーする必要がある。同一記事内の複数ウィジェットが同時にマウントされるため、
// モジュールスコープのフラグで「1回のマウントバッチにつき1回だけ」実行されるように制御する
let moshimoBatchStarted = false;
let moshimoTriggerScheduled = false;
let bundleExistedBeforeBatch = false;

const prepareMoshimoBatch = () => {
  if (moshimoBatchStarted) return;
  moshimoBatchStarted = true;
  // エフェクトのフラッシュは同期的に完了するため、マイクロタスクでフラグを戻すと
  // 「同じコミットでマウントされたウィジェット群 = 1バッチ」として扱える
  queueMicrotask(() => {
    moshimoBatchStarted = false;
  });
  bundleExistedBeforeBatch = !!document.getElementById(MOSHIMO_LOADER_ID);
  // 前のページで積まれた処理済み・未処理のキューが残っていると、bundle.jsが古いエントリを
  // 再処理して重複描画や例外を起こすため、このページ分を積む前に破棄する。
  // ただしトリガー待ち(スケジュール済み)のキューは、遅延初期化で直前に発火した
  // 別ウィジェットの処理前エントリなので破棄してはいけない(破棄するとそのウィジェットが
  // 永久に描画されない。E2E: moshimo-lazy.spec.ts MOSHIMO-03で回帰検知)
  if (moshimoTriggerScheduled) return;
  const loader = window.msmaflink;
  if (loader && Array.isArray(loader.q)) {
    loader.q.length = 0;
  }
};

const scheduleMoshimoTrigger = () => {
  if (moshimoTriggerScheduled) return;
  moshimoTriggerScheduled = true;
  // 後続のバッチがモジュール変数を上書きしても影響しないよう、この時点の値を捕捉する
  const bundleExisted = bundleExistedBeforeBatch;
  // ウィジェット全件のscript実行(キュー積み込み)が終わってから発火させる
  setTimeout(() => {
    moshimoTriggerScheduled = false;
    const bundle = document.getElementById(MOSHIMO_LOADER_ID);
    if (!bundle) return;
    const dispatch = () => {
      // ウィジェットの描画先が既にアンマウントされていれば何もしない
      if (!document.querySelector('[id^="msmaflink-"]')) return;
      window.dispatchEvent(new Event("load"));
    };
    if (bundleExisted) {
      // bundle.jsが前のページ遷移でロード済みの場合は即時ディスパッチできる
      dispatch();
      return;
    }
    // このバッチで初めて生成されたbundle.jsはロード完了を待ってからディスパッチする
    bundle.addEventListener("load", dispatch, { once: true });
  }, 0);
};

// React(html-react-parser)経由でDOMに挿入されたscriptタグはブラウザ仕様により実行されない。
// そのため本文中のscriptタグをこのコンポーネントに置き換え、マウント時にDOM APIで
// script要素を生成し直して実行させる。ソフトナビゲーションで記事へ遷移した場合も
// 再マウントされるため、ハードナビゲーションと同様にウィジェット等が描画される
const ExecutableScript = ({ attribs, code, lazyRootMargin }: ExecutableScriptProps) => {
  const anchorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor || !anchor.parentNode) return;

    // 遅延実行時はクリーンアップ時点でscript未挿入の可能性があるため、参照をクロージャで持つ
    let script: HTMLScriptElement | null = null;

    const execute = () => {
      const isMoshimo = code.includes(MOSHIMO_LOADER_ID);
      if (isMoshimo) {
        prepareMoshimoBatch();
      }

      const element = document.createElement("script");
      Object.entries(attribs).forEach(([name, value]) => {
        element.setAttribute(name, value);
      });
      if (code) {
        element.text = code;
      }
      // bundle.jsは「script要素の直後の兄弟がウィジェット本体かどうか」を重複描画ガードに
      // 使っているため、ラッパー内ではなく元のscriptタグと同じ位置(anchorの直後)に挿入する
      anchor.parentNode?.insertBefore(element, anchor.nextSibling);
      script = element;

      if (isMoshimo) {
        scheduleMoshimoTrigger();
      }
    };

    if (!lazyRootMargin || typeof IntersectionObserver === "undefined") {
      execute();
      return () => {
        script?.remove();
      };
    }

    // 遅延実行: 埋め込みがビューポートに接近(rootMargin分手前)して初めてスクリプトを実行する。
    // 外部リソース(もしものbundle.js+商品画像等)を初期ロードのLCP帯域から退避させるのが目的。
    // anchor自身はサイズ0のspanのため、描画先divを含む親要素を観測して交差判定を確実にする
    const target = anchor.parentElement ?? anchor;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        execute();
      },
      { rootMargin: lazyRootMargin },
    );
    observer.observe(target);

    return () => {
      observer.disconnect();
      script?.remove();
    };
    // 同一インスタンスの再レンダリングで重複実行しないよう、マウント時のみ実行する
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <span ref={anchorRef} />;
};

export default ExecutableScript;

declare global {
  interface Window {
    msmaflink?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}
