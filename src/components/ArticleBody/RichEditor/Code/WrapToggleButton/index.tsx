"use client";

import { useCallback, useState } from "react";

type WrapToggleButtonProps = {
  onToggleWrap: (isWrapped: boolean) => void;
};

const WrapToggleButton = ({ onToggleWrap }: WrapToggleButtonProps) => {
  const [isWrapped, setIsWrapped] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleWrap = useCallback(() => {
    const newWrappedState = !isWrapped;
    setIsWrapped(newWrappedState);
    onToggleWrap(newWrappedState);
    
    // ツールチップを一時的に表示
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 1500);
  }, [isWrapped, onToggleWrap]);

  return (
    <button
      className="relative h-6 w-6 cursor-pointer text-[#9ca4b5] transition-colors hover:text-[#b4bccf] group"
      onClick={toggleWrap}
      aria-label={isWrapped ? "折り返しなし" : "折り返し"}
    >
      <svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-6 w-6"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  {isWrapped ? (
    // Unwrap icon - 長い一行のテキストと矢印で展開を表現
    <>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <polyline points="18 9 21 12 18 15"></polyline>
    </>
  ) : (
    // Wrap icon - テキストが折り返される様子を滑らかな曲線で表現
    <>
      <line x1="3" y1="8" x2="16" y2="8"></line>
      <path d="M16 8c0 0 4 0 4 4s-4 4-4 4H10"></path>
      <polyline points="13 13 10 16 13 19"></polyline>
    </>
  )}
</svg>
      {/* ツールチップ */}
      <span 
        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-[#9ca4b5] text-xs whitespace-nowrap bg-[#282a2e] px-2 py-1 rounded transition-opacity ${
          showTooltip ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {isWrapped ? "折り返しなし" : "折り返し"}
      </span>
    </button>
  );
};

export default WrapToggleButton;
