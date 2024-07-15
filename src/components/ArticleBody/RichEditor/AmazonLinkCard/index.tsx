import { amazonLinkCardOptions } from "@/components/ArticleBody/RichEditor/ReplaceUiParts.lib";
import parser from "html-react-parser";

type AmazonLinkCardProps = {
  html: string;
}

const AmazonLinkCard = ({ html }: AmazonLinkCardProps) => {
  return (
    <aside className="w-full">
      {parser(html, amazonLinkCardOptions)}
    </aside>
  )
}
export default AmazonLinkCard;