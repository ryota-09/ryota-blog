import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ※ 本来なら環境変数として利用する
const CUSTOM_HEADER_KEY_NAME = 'custom-header-value'
const CUSTOM_HEADER_VALUE = 'custom-header-value'

export function middleware(request: NextRequest) {
  const customHeaderValue = request.headers.get(CUSTOM_HEADER_KEY_NAME);
  // if (customHeaderValue !== CUSTOM_HEADER_VALUE) {
  //   return NextResponse.redirect(new URL('/403', request.url))
  // }

  // return NextResponse.redirect(new URL('/', request.url))
  return NextResponse.next()
}

// export const config = {
//   matcher: '/',
// }