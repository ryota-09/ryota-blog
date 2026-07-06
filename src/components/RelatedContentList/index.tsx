'use client';
import { useTranslations } from 'next-intl';
import RelatedContentItem from "@/components/RelatedContentList/RelatedContentItem";
import type { BlogPost } from "@/types/content";

type RelatedContentProps = {
  data: Pick<BlogPost, "slug" | "publishedAt" | "updatedAt" | "title" | "categories">[]
}

const RelatedContentList = ({ data }: RelatedContentProps) => {
  const t = useTranslations('blog');

  return (
    <>
      <div className="text-2xl dark:text-gray-300 font-bold mb-4">{t('relatedPosts')}</div>
      <ul className="divide-y">
        {data.map(({ slug, publishedAt, updatedAt, title, categories }) => (
          <RelatedContentItem key={slug} id={slug} publishedAt={publishedAt} updatedAt={updatedAt} title={title} categories={categories} />
        ))}
      </ul>
    </>
  );
}
export default RelatedContentList;