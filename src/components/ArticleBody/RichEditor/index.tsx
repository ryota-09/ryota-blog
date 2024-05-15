import { customReplaceOptions } from "@/components/ArticleBody/RichEditor/ReplaceUiParts.lib";
import parser from "html-react-parser";

type PropsType = {
  html: string;
};

const RichEditor = ({ html }: PropsType) => {
  return <>{parser(html, customReplaceOptions)}</>;
};
export default RichEditor;