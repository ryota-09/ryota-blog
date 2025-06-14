"use client";

import { useState, useCallback, useMemo } from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';
import CopyButton from '@/components/ArticleBody/RichEditor/Code/CopyButton';
import WrapToggleButton from '@/components/ArticleBody/RichEditor/Code/WrapToggleButton';
import { CODE_BLOCK_STYLES } from '../constants';

type MultiCodeBlockProps = {
  children: string | string[];
  filename: string | null;
  lang?: string;
  defaultWrapped?: boolean;
  className?: string;
};

const MultiCodeBlock = ({ 
  lang, 
  filename, 
  children, 
  defaultWrapped = false,
  className 
}: MultiCodeBlockProps) => {
  const [isWrapped, setIsWrapped] = useState(defaultWrapped);
  
  const handleToggleWrap = useCallback((wrapped: boolean) => {
    setIsWrapped(wrapped);
  }, []);

  // コードテキストをメモ化してパフォーマンス向上
  const codeContent = useMemo(() => {
    if (Array.isArray(children)) {
      return children.join('\n');
    }
    return children || '';
  }, [children]);

  // カスタムスタイルをメモ化
  const customStyle = useMemo(() => ({
    margin: 0,
    borderRadius: filename ? '0 0 0.375rem 0.375rem' : '0.375rem',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    backgroundColor: CODE_BLOCK_STYLES.background,
  }), [filename]);

  return (
    <div className={`my-4 w-full max-w-[83vw] sm:max-w-[600px] md:max-w-[730px] lg:max-w-[1028px] ${className || ''}`}>
      {filename && (
        <div 
          className={`text-sm bg-[${CODE_BLOCK_STYLES.background}] text-[#9ca4b5] py-2 px-3 rounded-t-md tracking-wider border-b border-[#3c3f43]`}
          role="banner"
          aria-label={`ファイル名: ${filename}`}
        >
          {filename}
        </div>
      )}
      
      <div className="relative">
        {/* ツールバー */}
        <div 
          className="absolute right-2 top-2 z-10 flex gap-2" 
          role="toolbar" 
          aria-label="コードブロック操作"
        >
          <WrapToggleButton 
            onToggleWrap={handleToggleWrap} 
            defaultWrapped={defaultWrapped}
          />
          <CopyButton text={codeContent} />
        </div>
        
        {/* コンテンツエリア */}
        <div className={isWrapped ? '' : 'overflow-x-auto'}>
          <SyntaxHighlighter 
            language={lang || 'text'} 
            style={oneDark}
            wrapLongLines={isWrapped}
            customStyle={customStyle}
            showLineNumbers={false}
            PreTag="div"
            CodeTag="code"
          >
            {codeContent}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default MultiCodeBlock;