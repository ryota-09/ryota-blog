"use client"
import CopyButton from '@/components/ArticleBody/RichEditor/Code/CopyButton';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';


type MultiCodeBlockProps = {
  children: string | string[]
  filename: string | null
  lang?: string
}

const MultiCodeBlock = ({ lang, filename, children }: MultiCodeBlockProps) => {
  return (
    <div className='my-4 w-[90vw] sm:w-[600px] md:w-[730px] md:max-w-[980px] lg:w-[1028px] overflow-x-auto'>
      {filename && <span className="text-sm bg-[#282a2e] text-[#9ca4b5] py-2 px-3 rounded-t-md tracking-wider">{filename}</span>}
      <CopyButton text={!Array.isArray(children) ? children : ""} />
      <SyntaxHighlighter language={lang} style={oneDark} customStyle={{ margin: 0 }}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
export default MultiCodeBlock;