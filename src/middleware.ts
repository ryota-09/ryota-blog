import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getBlogByIdByLocale } from './lib/microcms'
import { getPrimaryCategoryId } from './lib/index'

// Create the intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // AWS App Runnerのホスト名をブロック
  if (request.nextUrl.hostname.includes('awsapprunner')) {
    return NextResponse.redirect(new URL('/404', request.url))
  }

  // ルートパスを処理 - 保存されたlocale設定またはデフォルトlocaleにリダイレクト
  if (pathname === '/') {
    // Check for preferred locale in cookies
    const preferredLocale = request.cookies.get('preferred-locale')?.value;
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
    console.log('Processing non-locale route:', pathname);
    
    // 古いブログURL構造 /blogs/[blogId] の処理
    const blogMatch = pathname.match(/^\/blogs\/([^\/]+)$/)
    if (blogMatch) {
      const blogId = blogMatch[1]
      console.log('Attempting to redirect blog:', blogId);
      
      try {
        const blog = await getBlogByIdByLocale(routing.defaultLocale, blogId, { fields: 'category' })
        const categoryId = getPrimaryCategoryId(blog)
        
        // 新しいURL構造にデフォルトlocaleでリダイレクト
        const newUrl = new URL(`/${routing.defaultLocale}/blogs/${categoryId}/${blogId}`, request.url)
        console.log('Redirecting to:', newUrl.toString());
        return NextResponse.redirect(newUrl, 301)
      } catch (error) {
        console.log('Blog not found, redirecting to blogs page:', error);
        // ブログが見つからない場合はデフォルトlocaleのブログページにリダイレクト
        const newUrl = new URL(`/${routing.defaultLocale}/blogs`, request.url)
        return NextResponse.redirect(newUrl, 301)
      }
    }

    // その他のlocaleなしルートはデフォルトlocaleにリダイレクト
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      const newUrl = new URL(`/${routing.defaultLocale}/${segments.join('/')}`, request.url);
      console.log('Redirecting other route to:', newUrl.toString());
      return NextResponse.redirect(newUrl, 301);
    }
  }

  // localeありの古いブログURL構造 /[locale]/blogs/[blogId] をチェック
  const localeMatch = pathname.match(/^\/([^\/]+)\/blogs\/([^\/]+)$/)
  if (localeMatch && routing.locales.includes(localeMatch[1] as any)) {
    const locale = localeMatch[1]
    const blogId = localeMatch[2]
    
    // 既に正しい形式（カテゴリを含む）の場合はnext-intlミドルウェアに進む
    if (blogId.includes('/')) {
      return intlMiddleware(request);
    }
    
    console.log('Processing locale blog redirect:', locale, blogId);
    try {
      const blog = await getBlogByIdByLocale(locale, blogId, { fields: 'category' })
      const categoryId = getPrimaryCategoryId(blog)
      
      // localeありの新しいURL構造にリダイレクト
      const newUrl = new URL(`/${locale}/blogs/${categoryId}/${blogId}`, request.url)
      console.log('Redirecting locale blog to:', newUrl.toString());
      return NextResponse.redirect(newUrl, 301)
    } catch (error) {
      console.log('Locale blog not found, continuing with intl middleware');
      return intlMiddleware(request);
    }
  }

  // 最後にnext-intlミドルウェアを実行
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};