import { DOMNode, Element, attributesToProps, domToReact, HTMLReactParserOptions } from "html-react-parser";

import CustomH3 from "@/components/ArticleBody/RichEditor/CustomUI/CustomH3";
import CustomH2 from "@/components/ArticleBody/RichEditor/CustomUI/CustomH2";
import CustomParagraph from "@/components/ArticleBody/RichEditor/CustomUI/CustomParagraph";
import CustomLink from "@/components/ArticleBody/RichEditor/CustomUI/CustomLink";
import CustomImg from "@/components/ArticleBody/RichEditor/CustomUI/CustomImg";
import CustomUl from "@/components/ArticleBody/RichEditor/CustomUI/CustomUl";
import CustomLi from "@/components/ArticleBody/RichEditor/CustomUI/CustomLi";
import MultiCodeBlock from "@/components/ArticleBody/RichEditor/Code/MultiCodeBlock";
import CustomBlockquote from "@/components/ArticleBody/RichEditor/CustomUI/CustomBlockquote";
import CustomTable from "@/components/ArticleBody/RichEditor/CustomUI/Table/CustomTable";
import CustomTbody from "@/components/ArticleBody/RichEditor/CustomUI/Table/CustomTbody";
import CustomTr from "@/components/ArticleBody/RichEditor/CustomUI/Table/CustomTr";
import CustomTh from "@/components/ArticleBody/RichEditor/CustomUI/Table/CustomTh";
import CustomTd from "@/components/ArticleBody/RichEditor/CustomUI/Table/CustomTd";
import CustomIframe from "@/components/ArticleBody/RichEditor/CustomUI/CustomIframe";
import CustomCode from "@/components/ArticleBody/RichEditor/CustomUI/CustomCode";
import CustomStrong from "@/components/ArticleBody/RichEditor/CustomUI/CustomStrong";
import ExternalLink from "@/components/UiParts/ExternalLink";
import PopupModal from "@/components/UiParts/PopupModal";
import CustomU from "@/components/ArticleBody/RichEditor/CustomUI/CustomU";
import CopyableText from "@/components/ArticleBody/RichEditor/CopyableText";

// Next.js 16では、Client Componentに対してssr: falseを使用できない
// TwitterCardは"use client"でマークされているため、通常のimportに変更
import TwitterCard from "@/components/ArticleBody/RichEditor/TwitterCard";

const isElement = (domNode: any): domNode is Element => {
  const isTag = ['tag', 'script'].includes(domNode.type);
  const hasAttributes = (domNode as Element).attribs !== undefined;

  return isTag && hasAttributes;
};

export const customReplaceOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (isElement(domNode) && domNode.attribs) {
      const props = attributesToProps(domNode.attribs);

      // ハイドレーションエラーが生じるため、scriptタグを削除
      if (domNode.name === "script" && domNode.attribs.src === "//cdn.iframe.ly/embed.js") {
        return <></>;
      }

      if (
        domNode.name === "div" &&
        domNode.attribs.class === "iframely-embed"
      ) {

        if (!domNode.firstChild) return

        const childDivElement = domNode.firstChild
        if (!isElement(childDivElement)) return

        const aElement = childDivElement.firstChild
        if (aElement && !("attribs" in aElement)) return;
        const href = aElement?.attribs.href
        return (
          // NOTE: スクロールバーが表示されるため、overflowY: "hidden" を指定
          <CustomIframe href={href ?? ""} className="w-full h-[90px] sm:h-[106px] md:h-[128px] lg:h-[174px] bg-white dark:bg-black" />
        );
      }

      switch (domNode.name) {
        case "h2":
          return <CustomH2 {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomH2>;
        case "h3":
          return <CustomH3 {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomH3>;
        case "p":
          // NOTE: pタグ内にchildrenがない場合、brタグを追加
          if (domNode.children.length === 0) {
            return <br />
          }
          if (domNode.parent && "name" in domNode.parent && domNode.parent.name === "blockquote") {
            return <CustomParagraph {...props} style={{ color: "#718096" }}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomParagraph>;
          }
          return <CustomParagraph {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomParagraph>;
        case "strong":
          return <CustomStrong {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomStrong>;
        case "u":
          return <CustomU {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomU>;
        case "a":
          const href = domNode.attribs.href;
          const isExternal = href.startsWith("http") || domNode.attribs.target === "_blank" || href.includes("amazon");
          if (isExternal) {
            return <ExternalLink {...props} href={href} className="underline underline-offset-4 transition hover:text-base-color dark:hover:text-primary hover:no-underline break-all">{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</ExternalLink>;
          }
          return <CustomLink {...props} href={href}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomLink>;
        case "img":
          const width = domNode.attribs.width;
          const height = domNode.attribs.height;
          if (!width || !height) {
            // eslint-disable-next-line @next/next/no-img-element
            return <img {...props} src={domNode.attribs.src} alt={domNode.attribs.alt} />;
          }
          // 親要素がaタグの場合、ポップアップさせない
          if (domNode.parent && "name" in domNode.parent && domNode.parent.name === "a") {
            return (
              <CustomImg {...props} src={domNode.attribs.src} alt={domNode.attribs.alt} width={width} height={height} />
            )
          }
          return (
            <PopupModal>
              <CustomImg {...props} src={domNode.attribs.src} alt={domNode.attribs.alt} width={width} height={height} />
            </PopupModal>
          )
        case "ul":
          return <CustomUl {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomUl>;
        case "li":
          return <CustomLi {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomLi>;
        case "blockquote":
          if (domNode.attribs.class === "twitter-tweet") {
            return (
              <TwitterCard {...props}>
                {domToReact(domNode.children as DOMNode[], customReplaceOptions)}
              </TwitterCard>
            )
          }
          return <CustomBlockquote {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomBlockquote>;
        case "code":
          return <CustomCode className="bg-gray-200 dark:bg-gray-400 font-mono text-sm dark:text-gray-700 px-1 py-0.5 rounded">{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomCode>
        case "pre":
          if (domNode.children[0].type === 'tag' && domNode.children[0].name === 'code') {
            let filename = null;
            if (domNode.parent) {
              filename = "attribs" in domNode.parent ? domNode.parent.attribs['data-filename'] : null;
            }
            const langAttr = 'attribs' in domNode.children[0] ? domNode.children[0].attribs.class : undefined;
            const lang = langAttr ? langAttr.replace('language-', '') : '';
            return <MultiCodeBlock filename={filename} lang={lang}>{"data" in domNode.children[0].children[0] ? domNode.children[0].children[0].data : ""}</MultiCodeBlock>;
          }
          return <pre>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</pre>
        case "table":
          return <CustomTable {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomTable>;
        case "tbody":
          return <CustomTbody {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomTbody>;
        case "tr":
          return <CustomTr {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomTr>;
        case "th":
          return <CustomTh {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomTh>;
        case "td":
          return <CustomTd {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CustomTd>;
        case "span":
          if (domNode.attribs.class === "copy") {
            return <CopyableText {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</CopyableText>;
          }
          return <span {...props}>{domToReact(domNode.children as DOMNode[], customReplaceOptions)}</span>;
      }
    }
  },
};

export const amazonLinkCardOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (isElement(domNode) && domNode.attribs) {
      const props = attributesToProps(domNode.attribs);

      switch (domNode.name) {
        case "a":
          const href = domNode.attribs.href;
          return (
            <ExternalLink {...props} href={href} className="relative flex flex-col md:flex-row items-center gap-8 px-4 py-8 md:px-6 md:py-4 border-[#D0AD77] border-[6px] hover:transition hover:opacity-80 hover:text-[#D0AD77] after:content-['Amazon'] after:text-gray-700 after:bg-[#D0AD77] after:absolute after:py-0 lg:after:py-2 md:after:py-0.5 after:px-4 after:w-auto after:top-0 after:right-0">
              {domToReact(domNode.children as DOMNode[], amazonLinkCardOptions)}
            </ExternalLink>
          )
        case "img":
          return (
            <figure className="overflow-hidden object-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img {...props} src={domNode.attribs.src} alt={domNode.attribs.alt} />
            </figure>
          )
      }
    }
  },
}