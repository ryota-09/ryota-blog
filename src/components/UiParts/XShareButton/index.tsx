"use client"

import ExternalLink from "@/components/UiParts/ExternalLink"
import { cltw } from "@/util";
import { ReactNode, useEffect, useState } from "react";

type XShareButtonProps = {
  text?: string;
  url?: string;
  hashtags?: string[];
  via?: string;
  related?: string[];
  in_reply_to?: string;
  classes?: string;
  children: ReactNode
}

const XShareButton = ({ text, url, hashtags, via, related, in_reply_to, classes, children }: XShareButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const targetURL = new URL("https://x.com/intent/tweet");
  if (text !== undefined) targetURL.searchParams.set("text",text);
  if (url !== undefined) targetURL.searchParams.set("url", url);
  if (hashtags !== undefined) targetURL.searchParams.set("hashtags", hashtags.join(","));
  if (via !== undefined) targetURL.searchParams.set("via", via);
  if (related !== undefined) targetURL.searchParams.set("related", related.join(","));
  if (in_reply_to !== undefined) targetURL.searchParams.set("in_reply_to", in_reply_to);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        // エントリーが見えるときは非表示、見えないときは表示
        setIsVisible(!entries[0].isIntersecting);
      },
      {
        root: null, // ビューポートを基準に
        threshold: 0.1, // 10%が見えたらcallbackを呼び出す
      }
    );

    const observedElement = document.createElement('div');
    observedElement.style.position = 'absolute';
    observedElement.style.top = '400px';
    observedElement.style.height = '1px';
    observedElement.style.width = '100%';
    document.body.appendChild(observedElement);

    observer.observe(observedElement);

    return () => {
      observer.disconnect();
      document.body.removeChild(observedElement);
    };
  }, []);

  return (
    <ExternalLink id="x-share-button" href={targetURL.toString()} className={cltw(classes, isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none')} style={{ fontFamily: "initial" }}>{children}</ExternalLink>
  )
}
export default XShareButton