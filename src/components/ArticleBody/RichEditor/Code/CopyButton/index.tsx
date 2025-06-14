"use client";

import { useCallback, useState } from "react";
import Tooltip from "../Tooltip";
import { CODE_BLOCK_STYLES, ICONS, TIMING } from "../constants";

type CopyButtonProps = {
  text: string;
  className?: string;
};

const CopyButton = ({ text, className }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy text:", error);
      // フォールバック: 古いブラウザ対応
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
      } catch (err) {
        console.error("Fallback copy failed:", err);
      }
      document.body.removeChild(textArea);
    }

    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, TIMING.tooltipDelay);
  }, [text]);

  const handleMouseEnter = useCallback(() => {
    if (!isCopied) {
      setIsHovered(true);
    }
  }, [isCopied]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const tooltipText = isCopied ? "コピーしました!" : "コピー";

  return (
    <button
      type="button"
      className={`${CODE_BLOCK_STYLES.button} ${className || ''}`}
      onClick={copyToClipboard}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={isCopied ? "コピー済み" : "コードをコピー"}
      title={tooltipText}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={CODE_BLOCK_STYLES.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {isCopied ? (
          // チェックマークアイコン
          <path d={ICONS.copy.success.path} />
        ) : (
          // コピーアイコン
          <>
            <rect {...ICONS.copy.default.rect} />
            <path d={ICONS.copy.default.path} />
          </>
        )}
      </svg>

      <Tooltip
        text={tooltipText}
        isVisible={isCopied || isHovered}
      />
    </button>
  )
}

export default CopyButton