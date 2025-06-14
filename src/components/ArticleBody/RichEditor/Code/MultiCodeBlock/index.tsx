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
    <div className='my-4 w-[83vw] sm:w-[600px] md:w-[730px] md:max-w-[980px] lg:w-[1028px]'>
      {filename && <span className="text-sm bg-[#282a2e] text-[#9ca4b5] py-2 px-3 rounded-t-md tracking-wider">{filename}</span>}
      <div className="relative">
        <div className="absolute right-2 top-2 z-10 flex gap-2">
          <WrapToggleButton onToggleWrap={handleToggleWrap} />
          <CopyButton text={!Array.isArray(children) ? children : ""} />
        </div>
        <div className={isWrapped ? '' : 'overflow-x-auto'}>
          <SyntaxHighlighter 
            language={lang} 
            style={oneDark}
            wrapLongLines={isWrapped}
            customStyle={{ 
              margin: 0
            }}
          >
            {children}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
export default MultiCodeBlock;