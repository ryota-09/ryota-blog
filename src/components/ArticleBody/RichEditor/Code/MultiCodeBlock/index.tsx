"use client"
import CopyButton from '@/components/ArticleBody/RichEditor/Code/CopyButton';
import WrapToggleButton from '@/components/ArticleBody/RichEditor/Code/WrapToggleButton';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';
import { useState, useCallback } from 'react';


type MultiCodeBlockProps = {
  children: string | string[]
  filename: string | null
  lang?: string
}

const MultiCodeBlock = ({ lang, filename, children }: MultiCodeBlockProps) => {
  const [isWrapped, setIsWrapped] = useState(false)
  
  const handleToggleWrap = useCallback((wrapped: boolean) => {
    setIsWrapped(wrapped)
  }, [])

  return (
    <div className='my-4 w-[83vw] sm:w-[600px] md:w-[730px] md:max-w-[980px] lg:w-[1028px] overflow-x-auto'>
      {filename && <span className="text-sm bg-[#282a2e] text-[#9ca4b5] py-2 px-3 rounded-t-md tracking-wider">{filename}</span>}
      <div className="relative">
        <CopyButton text={!Array.isArray(children) ? children : ""} />
        <div className="absolute right-10 top-0">
          <WrapToggleButton onToggleWrap={handleToggleWrap} />
        </div>
      </div>
      <SyntaxHighlighter 
        language={lang} 
        style={oneDark} 
        customStyle={{ 
          margin: 0,
          whiteSpace: isWrapped ? 'pre-wrap' : 'pre',
          wordBreak: isWrapped ? 'break-all' : 'normal'
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
export default MultiCodeBlock;