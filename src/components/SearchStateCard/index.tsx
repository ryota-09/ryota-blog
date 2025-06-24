'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Chip from "@/components/UiParts/Chip";
import type { MappedKeyLiteralType } from "@/types/microcms";
import { CATEGORY_MAPED_ID } from "@/static/blogs";

type SearchStateCardProps = {
  /**
   * 検索キーワード
   */
  keyword?: string;
  /**
   * カテゴリー
   */
  category?: MappedKeyLiteralType | string
  /**
   * ロケール
   */
  locale: string
}

const SearchStateCard = ({ keyword, category, locale }: SearchStateCardProps) => {
  const t = useTranslations('blog');
  const tCategories = useTranslations('categories');
  
  // カテゴリ表示名を取得
  const getCategoryLabel = (categoryValue: string) => {
    // カテゴリ名からIDを取得（CATEGORY_MAPED_NAMEから渡される場合）
    const categoryId = CATEGORY_MAPED_ID[categoryValue as keyof typeof CATEGORY_MAPED_ID] || categoryValue;
    
    // カテゴリIDが翻訳キーとして存在する場合は翻訳を使用
    try {
      return tCategories(categoryId as any);
    } catch {
      // 翻訳が見つからない場合は元の値を返す
      return categoryValue;
    }
  };
  
  return (
    <div className="bg-white dark:bg-black px-3.5 flex flex-grow flex-col lg:flex-row items-center gap-2 lg:gap-10 border-2 border-gray-200 dark:border-gray-600">
      <div className="flex items-center gap-2 w-full lg:w-auto">
        <svg className="text-gray-500 dark:text-gray-300 w-4 h-4 lg:w-8 lg:h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="10" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p className="text-sm lg:text-lg text-gray-500 dark:text-gray-300">{t('searchConditions')} </p>
      </div>
      <div className="flex flex-col lg:flex-row flex-grow justify-between items-center gap w-full lg:w-auto">
        <ul className="flex gap-4 items-center">
          {category && (
            <li data-testid="pw-search-chip-category">
              <Chip classes=" text-xs lg:text-md bg-base-color dark:bg-primary px-3 py-2 text-sm text-txt-base dark:text-white" label={getCategoryLabel(category)} />
            </li>
          )}
          {keyword && (
            <li data-testid="pw-search-chip-keyword">
              <Chip classes="text-xs lg:text-md bg-light dark:bg-secondary px-3 py-2 text-sm text-txt-base dark:text-white" label={keyword} />
            </li>
          )}
        </ul>
        <div className="w-full lg:w-auto text-right" data-testid="pw-reset-search-state">
          <Link href="/blogs" className="text-gray-400 text-xs cursor-pointer transition-colors hover:text-gray-700 dark:hover:text-gray-300">{t('resetSearchConditions')}</Link>
        </div>
      </div>
    </div>
  )
}
export default SearchStateCard;