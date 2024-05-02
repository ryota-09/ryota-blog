import { DOMNode, Element, attributesToProps, domToReact, HTMLReactParserOptions } from "html-react-parser";
import CustomH3 from "@/components/ArticleBody/RichEditor/CustomUI/CustomH3";

const isElement = (domNode: DOMNode): domNode is Element => {
  const isTag = ['tag', 'script'].includes(domNode.type);
  const hasAttributes = (domNode as Element).attribs !== undefined;

  return isTag && hasAttributes;
};

export const customReplaceOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (isElement(domNode) && domNode.attribs) {
      const props = attributesToProps(domNode.attribs);

      if (domNode.name === "h3") {
        return (
          <CustomH3 {...props}>
            {domToReact(domNode.children as DOMNode[], customReplaceOptions)}
          </CustomH3>
        );
      }
    }
  },
};