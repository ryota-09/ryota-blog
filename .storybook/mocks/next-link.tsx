import React from "react";

// next/link の Storybook 用モック
const MockLink = ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => {
  return <a {...props}>{children}</a>;
};

export default MockLink;
