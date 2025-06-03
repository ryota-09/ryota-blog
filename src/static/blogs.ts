export const AUTHOR_NAME = 'りょた';
export const AUTHOR_DESCRIPTION = 'りょたといいます！ 都内でエンジニアやってます！ Software Developer | DevCan#2 hostedBy Classmethod | React.js | Next.js | AWS SAA / DVA / SOA';
export const SITE_TITLE = 'Ryota-Blog';
export const SITE_DOMAIN = 'ryotablog.jp';
export const AUTHOR_E_MAIL = "ryotadevelop@webclouddev.com";
export const SITE_DESCRIPTION = '技術ブログです！ React.js, Next.js, AWSなどの技術について書いています！';
export const SITE_DESCRIPTION_EN = 'This is a technical blog! I write about technologies such as React.js, Next.js, and AWS!';
export const PER_PAGE = 4;
export const KEYWORD_QUERY = "keyword";
export const PAGE_QUERY = "page";
export const CATEGORY_QUERY = "category";
export const BLOG_TYPE_QUERY = "blogType";

export const CATEGORY_MAPED_ID = {
  "TypeScript": "typescript",
  "CSS": "css",
  "Next.js": "next_js",
  "Release Notes": "release_notes",
  "AWS": "aws",
  "レビュー": "review",
  "雑記": "zakki",
  "React": "react",
  "OpenAI API": "openai_api",
  "ガジェット": "gadget",
  "TailwindCSS": "tailwindcss",
  "UI": "ui-parts",
  "プログラミング": "programming",
  "Career": "career",
  "LifeHack": "life_hack",
  "時事": "news",
  "Terraform": "terraform",
} as const;

export const CATEGORY_ARRAY = Object.entries(CATEGORY_MAPED_ID).map(([name, id]) => ({
  id,
  name
}));

export const CATEGORY_MAPED_NAME = Object.fromEntries(
  Object.entries(CATEGORY_MAPED_ID).map(([key, value]) => [value, key])
) as { [key: string]: string };