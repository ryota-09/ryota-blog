import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.hostname.includes('awsapprunner')) {
    return NextResponse.redirect('/404')
  }
  return NextResponse.next()
}