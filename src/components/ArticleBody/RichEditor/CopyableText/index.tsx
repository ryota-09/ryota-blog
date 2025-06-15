"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type PropsType = {
  children: React.ReactNode;
  className?: string;
};

const CopyableText = ({ children, className }: PropsType) => {
  const [copied, setCopied] = useState(false);
  const t = useTranslations('blog');

  const handleCopy = async () => {
    const text = typeof children === 'string' ? children : children?.toString() || "";
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCopy();
    }
  };

  return (
    <span className={`relative inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded ${className || ""}`}>
      <span 
        className="px-2 py-1 font-mono text-sm"
      >
        {children}
      </span>
      <button
        onClick={handleCopy}
        onKeyDown={handleKeyDown}
        className="inline-flex items-center justify-center px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none rounded-r"
        aria-label={t('copyCodeAriaLabel')}
        type="button"
        tabIndex={0}
      >
        {copied ? (
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-green-600 dark:text-green-400"
            aria-hidden="true"
          >
            <path 
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" 
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            aria-hidden="true"
          >
            <path 
              d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" 
              fill="currentColor"
            />
          </svg>
        )}
      </button>
      {copied && (
        <span 
          className="absolute left-full ml-2 px-2 py-1 text-xs bg-gray-800 dark:bg-gray-700 text-white rounded shadow-lg animate-fade-in z-10 whitespace-nowrap"
          role="status"
          aria-live="polite"
        >
          {t('copied')}
        </span>
      )}
    </span>
  );
};

export default CopyableText;