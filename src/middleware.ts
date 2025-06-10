import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getBlogById } from './lib/microcms'
import { getPrimaryCategoryId } from './lib/index'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.hostname.includes('awsapprunner')) {
    return NextResponse.redirect('/404')
  }

  // 旧ブログURL構造 /blogs/[blogId] から /blogs/[category]/[blogId] へのリダイレクト処理
  const blogMatch = request.nextUrl.pathname.match(/^\/blogs\/([^\/]+)$/)
  if (blogMatch) {
    const blogId = blogMatch[1]
    
    try {
      // カテゴリ情報を取得するためにブログデータを取得
      const blog = await getBlogById(blogId, { fields: 'category' })
      const categoryId = getPrimaryCategoryId(blog)
      
      // 新しいURL構造に301永続リダイレクト
      const newUrl = new URL(`/blogs/${categoryId}/${blogId}`, request.url)
      return NextResponse.redirect(newUrl, 301)
    } catch (error) {
      // ブログが見つからない場合はNext.jsの404処理に委ねる
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}