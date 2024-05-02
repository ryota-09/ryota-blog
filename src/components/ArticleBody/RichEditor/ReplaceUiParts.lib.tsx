import { DOMNode, Element, attributesToProps, domToReact, HTMLReactParserOptions } from "html-react-parser";
import CustomH3 from "@/components/ArticleBody/RichEditor/CustomUI/CustomH3";
import CustomH2 from "@/components/ArticleBody/RichEditor/CustomUI/CustomH2";
import CustomParagraph from "@/components/ArticleBody/RichEditor/CustomUI/CustomParagraph";
import CustomLink from "@/components/ArticleBody/RichEditor/CustomUI/CustomLink";

const isElement = (domNode: DOMNode): domNode is Element => {
  const isTag = ['tag', 'script'].includes(domNode.type);
  const hasAttributes = (domNode as Element).attribs !== undefined;

  return isTag && hasAttributes;
};

export const customReplaceOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (isElement(domNode) && domNode.attribs) {
      const props = attributesToProps(domNode.attribs);

      switch (domNode.name) {
        case "h2":
          return <CustomH2 {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomH2>;
        case "h3":
          return <CustomH3 {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomH3>;
        case "p":
          return <CustomParagraph {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomParagraph>;
        case "a":
          return <CustomLink {...props} href={domNode.attribs.href}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomLink>;
      }
    }
  },
};