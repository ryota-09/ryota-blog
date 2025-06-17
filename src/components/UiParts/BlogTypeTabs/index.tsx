"use client";
import { GlobalContext } from "@/providers";
import { BLOG_TYPE_ASSETS, BlogTypeKeyLIteralType } from "@/types";
import { cltw } from "@/util";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import React, { useCallback, useContext, useState } from "react";

type BlogTypeTabsProps = {
  /**
   * 一覧表示するブログの種類
   */
  blogType: BlogTypeKeyLIteralType;
};

const BlogTypeTabs = ({ blogType }: BlogTypeTabsProps) => {
  const { dispatch } = useContext(GlobalContext);
  const [activeTab, setActiveTab] = useState<BlogTypeKeyLIteralType>(
    blogType || "blogs",
  );
  const locale = useLocale();
  const router = useRouter();

  const blogButtonHandler = useCallback(() => {
    setActiveTab("blogs");
    dispatch({ type: "SET_BLOG_TYPE", payload: { blogType: "blogs" } });
    router.push(`/${locale}/blogs`);
  }, [locale, dispatch, router]);

  const zennButtonHandler = useCallback(() => {
    setActiveTab("zenn");
    dispatch({ type: "SET_BLOG_TYPE", payload: { blogType: "zenn" } });
    router.push(`/${locale}/blogs/zenn`);
  }, [locale, dispatch, router]);

  return (
    <nav className="relative flex flex-grow bg-transparent" role="navigation">
      <div
        className={cltw(
          "absolute inset-0 w-1/2 rounded-sm transition-all duration-300",
          activeTab === "blogs" ? "bg-base-color dark:bg-primary" : "bg-zenn",
        )}
        style={{
          transform:
            activeTab === "blogs" ? "translateX(0%)" : "translateX(100%)",
        }}
      />
      <button
        type="button"
        className={cltw(
          "relative z-10 w-1/2 px-4 py-2 text-center text-lg font-medium text-txt-base transition-all duration-300",
          activeTab === "blogs" ? "" : "text-txt-base dark:text-gray-400",
        )}
        onClick={blogButtonHandler}
        data-testid="pw-blog-type-tabs-blogs"
      >
        {BLOG_TYPE_ASSETS["blogs"]}
      </button>
      <button
        type="button"
        className={cltw(
          "relative z-10 w-1/2 px-4 py-2 text-center text-lg font-medium text-txt-base transition-all duration-300",
          activeTab === "zenn" ? "" : "dark:text-gray-400",
        )}
        onClick={zennButtonHandler}
        data-testid="pw-blog-type-tabs-zenn"
      >
        {BLOG_TYPE_ASSETS["zenn"]}
      </button>
    </nav>
  );
};

export default BlogTypeTabs;
