import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { isRoutingLocale, routing } from './i18n/routing';
import { LOCALE_COOKIE_NAME } from './types/locale'
import { CATEGORIES } from './static/categories'
import { classifyAiAccess } from './lib/ai-access/classify'
import { recordAiAccessHit } from './lib/ai-access/repository'
import type { AiBotDefinition } from './lib/ai-access/types'
// NOTE: 旧URL(/blogs/{slug})のカテゴリ解決用の軽量静的マップ(slug×locale→プライマリカテゴリid)。
// Veliteのcomplete フック(velite.config.ts)がビルド時に生成する。記事本文は含まないため、
// これをproxyがimportしてもバンドルサイズへの影響は軽微(数KB)。
import categoryMap from '../.velite/category-map.json'

const CATEGORY_SLUGS = CATEGORIES.map((category) => category.slug)

// slugからプライマリカテゴリidを解決する。該当記事がマップに存在しない場合はundefinedを返す
// (呼び出し元は「記事が存在しない」ケースとして扱い、旧microCMS版のtry/catchと同じ分岐を再現する)
const resolvePrimaryCategoryIdBySlug = (locale: string, blogId: string): string | undefined => {
  const localeMap = (categoryMap as Record<string, Record<string, string>>)[locale] ?? categoryMap.ja
  return localeMap[blogId]
}

// 旧URL（/[locale]/blogs/[blogId]）リダイレクト判定でフェッチ対象外にする既知セグメント
const NON_BLOG_ID_SEGMENTS = new Set<string>([...CATEGORY_SLUGS, 'zenn', 'page'])

// 記事詳細ページのcanonical URL: /{locale}/blogs/{categoryId}/{blogId}
const ARTICLE_PATH_PATTERN = /^\/([^/]+)\/blogs\/([^/]+)\/([^/]+)$/
const KNOWN_CATEGORY_IDS = new Set<string>(CATEGORY_SLUGS)

// 管理者ページのcanonical URL: /{locale}/admin(/...)
const ADMIN_PATH_PATTERN = /^\/[^/]+\/admin(\/.*)?$/

// Create the intl middleware
const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;

  // 管理者ページはBasic認証で保護する
  if (ADMIN_PATH_PATTERN.test(pathname)) {
    const unauthorized = await checkAdminBasicAuth(request)
    if (unauthorized) return unauthorized
  }

  // AIボットによる記事アクセスを検出したら、レスポンスに影響させず非同期でD1へ記録する
  recordAiAccessIfArticleRequest(request, event, pathname)

  // ルートパスを処理 - 保存されたlocale設定またはデフォルトlocaleにリダイレクト
  if (pathname === '/') {
    // 言語切替で保存される NEXT_LOCALE クッキーから優先ロケールを取得する
    const preferredLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
    const targetLocale = isRoutingLocale(preferredLocale)
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
      const categoryId = resolvePrimaryCategoryIdBySlug(routing.defaultLocale, blogId)

      if (categoryId) {
        // 新しいURL構造にデフォルトlocaleでリダイレクト
        const newUrl = new URL(`/${routing.defaultLocale}/blogs/${categoryId}/${blogId}`, request.url)
        return NextResponse.redirect(newUrl, 301)
      } else {
        // ブログが見つからない場合はデフォルトlocaleのブログページにリダイレクト
        const newUrl = new URL(`/${routing.defaultLocale}/blogs`, request.url)
        return NextResponse.redirect(newUrl, 301)
      }
    }

    // その他のlocaleなしルートはデフォルトlocaleにリダイレクト
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      const newUrl = new URL(`/${routing.defaultLocale}/${segments.join('/')}`, request.url);
      // NOTE: new URL(path, base)はbase側のクエリ文字列を引き継がないため、明示的に引き継ぐ。
      // 旧URL(/blogs?keyword=xxx等)の検索条件がリダイレクトで失われるバグの修正(#241)
      newUrl.search = request.nextUrl.search;
      return NextResponse.redirect(newUrl, 301);
    }
  }

  // localeありの古いブログURL構造 /[locale]/blogs/[blogId] をチェック
  // NOTE: カテゴリページ（/ja/blogs/typescript 等）や zenn/page は既知セグメントとして除外し、
  //       無駄な microCMS フェッチを発生させずに intl ミドルウェアへ流す
  const localeMatch = pathname.match(/^\/([^\/]+)\/blogs\/([^\/]+)$/)
  if (
    localeMatch &&
    isRoutingLocale(localeMatch[1]) &&
    !NON_BLOG_ID_SEGMENTS.has(localeMatch[2])
  ) {
    const locale = localeMatch[1]
    const blogId = localeMatch[2]
    const categoryId = resolvePrimaryCategoryIdBySlug(locale, blogId)

    if (categoryId) {
      // localeありの新しいURL構造にリダイレクト
      const newUrl = new URL(`/${locale}/blogs/${categoryId}/${blogId}`, request.url)
      return NextResponse.redirect(newUrl, 301)
    } else {
      return intlMiddleware(request);
    }
  }

  // 最後にnext-intlミドルウェアを実行
  return intlMiddleware(request);
}

// 管理者ページへのBasic認証チェック。認証済みなら null、未認証なら401レスポンスを返す
async function checkAdminBasicAuth(request: NextRequest): Promise<NextResponse | null> {
  const unauthorizedResponse = new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
  })

  let expectedUser: string | undefined
  let expectedPassword: string | undefined
  try {
    const { env } = await getCloudflareContext({ async: true })
    expectedUser = env.ADMIN_BASIC_AUTH_USER
    expectedPassword = env.ADMIN_BASIC_AUTH_PASSWORD
  } catch {
    // ローカル開発(next dev)ではCloudflareランタイムが存在せず取得に失敗するため、Basic認証をスキップする
    return null
  }

  // 認証情報が未設定の環境（シークレット未設定のデプロイ）ではフェイルクローズし、常に認証を要求する
  if (!expectedUser || !expectedPassword) return unauthorizedResponse

  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Basic ')) {
    const decoded = atob(authHeader.slice('Basic '.length))
    const separatorIndex = decoded.indexOf(':')
    const user = decoded.slice(0, separatorIndex)
    const password = decoded.slice(separatorIndex + 1)
    if (user === expectedUser && password === expectedPassword) {
      return null
    }
  }

  return unauthorizedResponse
}

// canonical記事URLへのアクセスをUA判定し、AIボットであればD1への記録をバックグラウンドで実行する
function recordAiAccessIfArticleRequest(request: NextRequest, event: NextFetchEvent, pathname: string): void {
  const match = pathname.match(ARTICLE_PATH_PATTERN)
  if (!match) return

  const [, locale, categoryId, blogId] = match
  if (!isRoutingLocale(locale) || !KNOWN_CATEGORY_IDS.has(categoryId)) {
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