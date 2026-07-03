import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { routing } from './i18n/routing';
import { getBlogByIdByLocale } from './lib/microcms'
import { getPrimaryCategoryId } from './lib/index'
import { LOCALE_COOKIE_NAME } from './types/locale'
import { CATEGORY_MAPED_ID } from './static/blogs'
import { classifyAiAccess } from './lib/ai-access/classify'
import { recordAiAccessHit } from './lib/ai-access/repository'
import type { AiBotDefinition } from './lib/ai-access/types'

// 旧URL（/[locale]/blogs/[blogId]）リダイレクト判定でフェッチ対象外にする既知セグメント
const NON_BLOG_ID_SEGMENTS = new Set<string>([...Object.values(CATEGORY_MAPED_ID), 'zenn', 'page'])

// 記事詳細ページのcanonical URL: /{locale}/blogs/{categoryId}/{blogId}
const ARTICLE_PATH_PATTERN = /^\/([^/]+)\/blogs\/([^/]+)\/([^/]+)$/
const KNOWN_CATEGORY_IDS = new Set<string>(Object.values(CATEGORY_MAPED_ID))

// Create the intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;

  // AIボットによる記事アクセスを検出したら、レスポンスに影響させず非同期でD1へ記録する
  recordAiAccessIfArticleRequest(request, event, pathname)

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

// canonical記事URLへのアクセスをUA判定し、AIボットであればD1への記録をバックグラウンドで実行する
function recordAiAccessIfArticleRequest(request: NextRequest, event: NextFetchEvent, pathname: string): void {
  const match = pathname.match(ARTICLE_PATH_PATTERN)
  if (!match) return

  const [, locale, categoryId, blogId] = match
  if (!routing.locales.includes(locale as (typeof routing.locales)[number]) || !KNOWN_CATEGORY_IDS.has(categoryId)) {
    return
  }

  const classification = classifyAiAccess(request.headers.get('user-agent'))
  if (!classification.isAiAccess) return

  event.waitUntil(recordAiAccessSafely({ locale, categoryId, blogId, bot: classification.bot }))
}

async function recordAiAccessSafely(params: {
  locale: string
  categoryId: string
  blogId: string
  bot: AiBotDefinition
}): Promise<void> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    if (!env.AI_ACCESS_DB) return // ローカルdev等バインディング未提供時は何もしない

    await recordAiAccessHit(env.AI_ACCESS_DB, {
      accessDate: new Date().toISOString().slice(0, 10),
      locale: params.locale,
      categoryId: params.categoryId,
      blogId: params.blogId,
      bot: params.bot,
    })
  } catch (error) {
    // 計測の失敗が記事表示という本体機能に波及しないよう握りつぶす
    console.error('[ai-access] record failed', error)
  }
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|.*\\..*).*)']
};