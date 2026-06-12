import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getBlogByIdByLocale } from './lib/microcms'
import { getPrimaryCategoryId } from './lib/index'
import { LOCALE_COOKIE_NAME } from './types/locale'
import { CATEGORY_MAPED_ID } from './static/blogs'

// 旧URL（/[locale]/blogs/[blogId]）リダイレクト判定でフェッチ対象外にする既知セグメント
const NON_BLOG_ID_SEGMENTS = new Set<string>([...Object.values(CATEGORY_MAPED_ID), 'zenn', 'page'])

// Create the intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // ルートパスを処理 - 保存されたlocale設定またはデフォルトlocaleにリダイレクト
  if (pathname === '/') {
    // 言語切替で保存される NEXT_LOCALE クッキーから優先ロケールを取得する
    const preferredLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
    const targetLocale = preferredLocale && routing.locales.includes(preferredLocale as any) 
      ? preferredLocale 
      : routing.defaultLocale;
    
    return NextResponse.redirect(new URL(`/${targetLocale}`, request.url));
  }

  // pathnameにlocaleが含まれているかチェック
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // localeが含まれていない古いルートの処理
  if (!pathnameHasLocale) {
    // 古いブログURL構造 /blogs/[blogId] の処理（カテゴリ等の既知セグメントは除外）
    const blogMatch = pathname.match(/^\/blogs\/([^\/]+)$/)
    if (blogMatch && !NON_BLOG_ID_SEGMENTS.has(blogMatch[1])) {
      const blogId = blogMatch[1]

      try {
        const blog = await getBlogByIdByLocale(routing.defaultLocale, blogId, { fields: 'category' })
        const categoryId = getPrimaryCategoryId(blog)

        // 新しいURL構造にデフォルトlocaleでリダイレクト
        const newUrl = new URL(`/${routing.defaultLocale}/blogs/${categoryId}/${blogId}`, request.url)
        return NextResponse.redirect(newUrl, 301)
      } catch {
        // ブログが見つからない場合はデフォルトlocaleのブログページにリダイレクト
        const newUrl = new URL(`/${routing.defaultLocale}/blogs`, request.url)
        return NextResponse.redirect(newUrl, 301)
      }
    }

    // その他のlocaleなしルートはデフォルトlocaleにリダイレクト
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      const newUrl = new URL(`/${routing.defaultLocale}/${segments.join('/')}`, request.url);
      return NextResponse.redirect(newUrl, 301);
    }
  }

  // localeありの古いブログURL構造 /[locale]/blogs/[blogId] をチェック
  // NOTE: カテゴリページ（/ja/blogs/typescript 等）や zenn/page は既知セグメントとして除外し、
  //       無駄な microCMS フェッチを発生させずに intl ミドルウェアへ流す
  const localeMatch = pathname.match(/^\/([^\/]+)\/blogs\/([^\/]+)$/)
  if (
    localeMatch &&
    routing.locales.includes(localeMatch[1] as any) &&
    !NON_BLOG_ID_SEGMENTS.has(localeMatch[2])
  ) {
    const locale = localeMatch[1]
    const blogId = localeMatch[2]

    try {
      const blog = await getBlogByIdByLocale(locale, blogId, { fields: 'category' })
      const categoryId = getPrimaryCategoryId(blog)

      // localeありの新しいURL構造にリダイレクト
      const newUrl = new URL(`/${locale}/blogs/${categoryId}/${blogId}`, request.url)
      return NextResponse.redirect(newUrl, 301)
    } catch {
      return intlMiddleware(request);
    }
  }

  // 最後にnext-intlミドルウェアを実行
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|.*\\..*).*)']
};