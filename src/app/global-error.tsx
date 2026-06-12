"use client"

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// ルートレイアウト自体で例外が発生した場合のフォールバック。
// global-error は <html>/<body> を自前で描画する必要がある。
const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  useEffect(() => {
    console.error('[global-error-boundary]', error.digest ?? '', error.message);
  }, [error]);

  return (
    <html lang="ja">
      <body>
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "24px", fontFamily: "sans-serif" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>500</h1>
          <p>予期しないエラーが発生しました。</p>
          <button
            onClick={() => reset()}
            style={{ padding: "8px 16px", border: "2px solid currentColor", background: "transparent", cursor: "pointer" }}
          >
            再試行する
          </button>
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
