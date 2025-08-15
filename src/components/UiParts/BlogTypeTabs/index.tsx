"use client"
import { GlobalContext } from '@/providers';
import { BLOG_TYPE_ASSETS, BlogTypeKeyLIteralType } from '@/types';
import { cltw } from '@/util';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import React, { useCallback, useContext, useState } from 'react';

type BlogTypeTabsProps = {
  /**
   * 一覧表示するブログの種類
   */
  blogType: BlogTypeKeyLIteralType;
}

const BlogTypeTabs = ({ blogType }: BlogTypeTabsProps) => {
  const { dispatch } = useContext(GlobalContext);
  const [activeTab, setActiveTab] = useState<BlogTypeKeyLIteralType>(blogType || "blogs");
  const locale = useLocale();

  const blogButtonHandler = useCallback(() => {
    setActiveTab("blogs")
    dispatch({ type: "SET_BLOG_TYPE", payload: { blogType: "blogs" } })
  }, [dispatch])

  const zennButtonHandler = useCallback(() => {
    setActiveTab("zenn")
    dispatch({ type: "SET_BLOG_TYPE", payload: { blogType: "zenn" } })
  }, [dispatch])


  return (
    <nav className="relative flex bg-transparent flex-grow">
      <div
        className={cltw("rounded-sm transition-all duration-300 w-1/2 absolute inset-0", activeTab === "blogs" ? 'bg-base-color dark:bg-primary' : 'bg-zenn')}
        style={{
          transform: activeTab === "blogs" ? 'translateX(0%)' : 'translateX(100%)',
        }}
      />
      <Link
        href={`/${locale}/blogs`}
        className={cltw("relative z-10 px-4 py-2 transition-all duration-300 text-center w-1/2 font-medium text-lg text-txt-base flex items-center justify-center", activeTab === "blogs" ? "" : "text-txt-base dark:text-gray-400")}
        onClick={blogButtonHandler}
        data-testid="pw-blog-type-tabs-blogs"
      >
        {BLOG_TYPE_ASSETS["blogs"]}
      </Link>
      <Link
        href={`/${locale}/blogs/zenn`}
        className={cltw("relative z-10 px-4 py-2 transition-all duration-300 text-center w-1/2 font-medium text-lg text-txt-base flex items-center justify-center", activeTab === "zenn" ? '' : 'dark:text-gray-400')}
        onClick={zennButtonHandler}
        data-testid="pw-blog-type-tabs-zenn"
      >
        {BLOG_TYPE_ASSETS["zenn"]}
      </Link>
    </nav>
  );
};

export default BlogTypeTabs