import { DOMNode, Element, attributesToProps, domToReact, HTMLReactParserOptions } from "html-react-parser";

const isElement = (domNode: DOMNode): domNode is Element => {
  const isTag = ['tag', 'script'].includes(domNode.type);
  const hasAttributes = (domNode as Element).attribs !== undefined;

  return isTag && hasAttributes;
};

export const customReplaceOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (isElement(domNode)) {
      const props = attributesToProps(domNode.attribs);

      if (domNode.attribs && domNode.name === "h3") {
        return (
          <h3 {...props} className=" bg-red-600">
            {domToReact(domNode.children as DOMNode[], customReplaceOptions)}
          </h3>
        );
      }
    }
  },
};