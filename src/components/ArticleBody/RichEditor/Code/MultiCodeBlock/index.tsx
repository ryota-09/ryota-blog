import CopyButton from '@/components/ArticleBody/RichEditor/Code/CopyButton';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


type MultiCodeBlockProps = {
  children: string | string[]
  filename: string | null
  lang?: string
}

const MultiCodeBlock = ({ lang, filename, children }: MultiCodeBlockProps) => {
  return (
    <div>
      {filename && <span className="text-sm bg-[#282a2e] text-[#9ca4b5] py-2 px-3 rounded-t-md tracking-wider">{filename}</span>}
      <CopyButton />
      <SyntaxHighlighter wrapLongLines language={lang} style={oneDark} customStyle={{ margin: 0 }}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
export default MultiCodeBlock;