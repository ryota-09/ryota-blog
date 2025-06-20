'use client';

import { Link } from 'next-view-transitions';
import { useLocale, useTranslations } from 'next-intl';
import Chip from '@/components/UiParts/Chip';

type CategoryTagProps = {
  name: string;
  index: number;
};

const CategoryTag = ({ name, index }: CategoryTagProps) => {
  const locale = useLocale();
  const t = useTranslations('categories');
  
  // カテゴリ名から対応するIDを取得（逆引き）
  const getCategoryId = (categoryName: string) => {
    const categoryMap: { [key: string]: string } = {
      'Python': 'python',
      'TypeScript': 'typescript',
      'CSS': 'css',
      'Next.js': 'next_js',
      'Release Notes': 'release_notes',
      'AWS': 'aws',
      'レビュー': 'review',
      '雑記': 'zakki',
      'React': 'react',
      'OpenAI API': 'openai_api',
      'ガジェット': 'gadget',
      'TailwindCSS': 'tailwindcss',
      'UI': 'ui_parts',
      'プログラミング': 'programming',
      'Career': 'career',
      'LifeHack': 'life_hack',
      '時事': 'news',
      'Terraform': 'terraform'
    };
    return categoryMap[categoryName] || 'programming';
  };
  
  const categoryId = getCategoryId(name);
  const localizedName = t(categoryId);
  
  return (
    <li key={index} className="block cursor-pointer">
      <Link href={`/${locale}/blogs?category=${name}`}>
        <Chip label={`#${localizedName}`} classes="bg-gray-200 dark:bg-gray-600 dark:text-gray-300 px-3 py-2 text-sm text-txt-base hover:opacity-60" />
      </Link>
    </li>
  );
};

export default CategoryTag;