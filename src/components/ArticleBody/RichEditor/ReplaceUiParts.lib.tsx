import { DOMNode, Element, attributesToProps, domToReact, HTMLReactParserOptions } from "html-react-parser";
import CustomH3 from "@/components/ArticleBody/RichEditor/CustomUI/CustomH3";
import CustomH2 from "@/components/ArticleBody/RichEditor/CustomUI/CustomH2";
import CustomParagraph from "@/components/ArticleBody/RichEditor/CustomUI/CustomParagraph";
import CustomLink from "@/components/ArticleBody/RichEditor/CustomUI/CustomLink";
import CustomImg from "@/components/ArticleBody/RichEditor/CustomUI/CustomImg";
import CustomUl from "@/components/ArticleBody/RichEditor/CustomUI/CustomUl";
import CustomLi from "@/components/ArticleBody/RichEditor/CustomUI/CustomLi";
import MultiCodeBlock from "@/components/ArticleBody/RichEditor/Code/MultiCodeBlock";

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
        case "img":
          return <CustomImg {...props} src={domNode.attribs.src} alt={domNode.attribs.alt} width={domNode.attribs.width} height={domNode.attribs.height} />;
        case "ul":
          return <CustomUl {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomUl>;
        case "li":
          return <CustomLi {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomLi>;
        case "code":
          return <code className="bg-gray-200 font-mono text-sm px-1 py-0.5 rounded">{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</code>
        case "pre":
          if (domNode.children[0].type === 'tag' && domNode.children[0].name === 'code') {
            let filename = null;
            if (domNode.parent) {
              filename = "attribs" in domNode.parent ? domNode.parent.attribs['data-filename'] : null;
            }
            const lang = domNode.children[0].attribs.class.replace('language-', '');
            // const filename = "attribs" in domNode.children[0].children[0] ? domNode.children[0].children[0].attribs['data-filename'] : null;
            return <MultiCodeBlock filename={filename} lang={lang}>{"data" in domNode.children[0].children[0] ? domNode.children[0].children[0].data : ""}</MultiCodeBlock>;
          }
          return <pre>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</pre>
      }
    }
  },
};