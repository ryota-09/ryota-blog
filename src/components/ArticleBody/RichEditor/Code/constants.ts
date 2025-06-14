// コードブロック関連の共通定数
export const CODE_BLOCK_STYLES = {
  // ボタンの基本スタイル
  button: 'relative h-6 w-6 cursor-pointer text-[#9ca4b5] transition-colors hover:text-[#b4bccf]',
  
  // ツールチップの基本スタイル
  tooltip: 'absolute -bottom-8 left-1/2 -translate-x-1/2 text-[#9ca4b5] text-xs whitespace-nowrap bg-[#282a2e] px-2 py-1 rounded transition-opacity pointer-events-none',
  
  // コードブロック背景色
  background: '#282a2e',
  
  // アイコンのスタイル
  icon: 'h-6 w-6',
} as const;

// タイミング関連の定数
export const TIMING = {
  tooltipDelay: 1500,
  hoverDelay: 300,
} as const;

// アイコンのパス定数
export const ICONS = {
  copy: {
    default: {
      rect: { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" },
      path: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
    },
    success: {
      path: "m9 12 2 2 4-4"
    }
  },
  wrap: {
    unwrap: {
      line: { x1: "3", y1: "12", x2: "21", y2: "12" },
      polyline: "18 9 21 12 18 15"
    },
    wrap: {
      line: { x1: "3", y1: "8", x2: "16", y2: "8" },
      path: "M16 8c0 0 4 0 4 4s-4 4-4 4H10",
      polyline: "13 13 10 16 13 19"
    }
  }
} as const;