"use client"
import { GlobalContext } from '@/providers';
import { BLOG_TYPE_ASSETS, BlogTypeKeyLIteralType } from '@/types';
import { cltw } from '@/util';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useContext, useEffect, useState } from 'react';

type BlogTypeTabsProps = {
  /**
   * 一覧表示するブログの種類
   */
  blogType: BlogTypeKeyLIteralType;
}

const BlogTypeTabs = ({ blogType }: BlogTypeTabsProps) => {
  const { dispatch } = useContext(GlobalContext);
  const [activeTab, setActiveTab] = useState<BlogTypeKeyLIteralType>(blogType || "blogs");

  const searchParams = useSearchParams();
  const router = useRouter();

  const blogButtonHandler = useCallback(() => {
    setActiveTab("blogs")
    dispatch({ type: "SET_BLOG_TYPE", payload: { blogType: "blogs" } })
    router.push('/blogs')
    router.refresh()
  }, [])

  const zennButtonHandler = useCallback(() => {
    setActiveTab("zenn")
    dispatch({ type: "SET_BLOG_TYPE", payload: { blogType: "zenn" } })
    router.push('/blogs?blogType=zenn')
    router.refresh()
  }, [])

  useEffect(() => {
    const blogType = searchParams.get("blogType")
    if (!blogType) {
      setActiveTab("blogs")
      dispatch({ type: "SET_BLOG_TYPE", payload: { blogType: "blogs" } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <nav className="relative flex bg-transparent flex-grow">
      <div
        className={cltw("rounded-sm transition-all duration-300 w-1/2 absolute inset-0", activeTab === "blogs" ? 'bg-base-color dark:bg-primary' : 'bg-zenn')}
        style={{
          transform: activeTab === "blogs" ? 'translateX(0%)' : 'translateX(100%)',
        }}
      />
      <button
        type='button'
        className={cltw("relative z-10 px-4 py-2 transition-all duration-300 text-center w-1/2 font-medium text-lg text-txt-base", activeTab === "blogs" ? "" : "text-txt-base dark:text-gray-400")}
        onClick={blogButtonHandler}
      >
        {BLOG_TYPE_ASSETS["blogs"]}
      </button>
      <button
        type='button'
        className={cltw("relative z-10 px-4 py-2 transition-all duration-300 text-center w-1/2 font-medium text-lg text-txt-base", activeTab === "zenn" ? '' : 'dark:text-gray-400')}
        onClick={zennButtonHandler}
      >
        {BLOG_TYPE_ASSETS["zenn"]}
      </button>
    </nav>
  );
};

export default BlogTypeTabs