"use client";

import { useCallback, useState } from "react";
import Tooltip from "../Tooltip";
import { CODE_BLOCK_STYLES, ICONS } from "../constants";

type WrapToggleButtonProps = {
  onToggleWrap: (isWrapped: boolean) => void;
  defaultWrapped?: boolean;
  className?: string;
};

const WrapToggleButton = ({ 
  onToggleWrap, 
  defaultWrapped = false,
  className 
}: WrapToggleButtonProps) => {
  const [isWrapped, setIsWrapped] = useState(defaultWrapped);
  const [isHovered, setIsHovered] = useState(false);

  const toggleWrap = useCallback(() => {
    const newWrappedState = !isWrapped;
    setIsWrapped(newWrappedState);
    onToggleWrap(newWrappedState);
  }, [isWrapped, onToggleWrap]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const tooltipText = isWrapped ? "折り返しなし" : "折り返し";

  return (
    <button
      type="button"
      className={`${CODE_BLOCK_STYLES.button} ${className || ''}`}
      onClick={toggleWrap}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={tooltipText}
      aria-pressed={isWrapped}
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
        {isWrapped ? (
          // Unwrap icon - 長い一行のテキストと矢印で展開を表現
          <>
            <line {...ICONS.wrap.unwrap.line} />
            <polyline points={ICONS.wrap.unwrap.polyline} />
          </>
        ) : (
          // Wrap icon - テキストが折り返される様子を表現
          <>
            <line {...ICONS.wrap.wrap.line} />
            <path d={ICONS.wrap.wrap.path} />
            <polyline points={ICONS.wrap.wrap.polyline} />
          </>
        )}
      </svg>
      
      <Tooltip
        text={tooltipText}
        isVisible={isHovered}
      />
    </button>
  );
};

export default WrapToggleButton;