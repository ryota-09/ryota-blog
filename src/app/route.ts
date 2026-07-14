import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// proxy.ts:51-59 が "/" を常に先取りしてリダイレクトするため、通常はこのハンドラーに
// 到達しない。OpenNext/Cloudflareが静的アセットを直接返す等でproxyを迂回した場合の
// セーフティネットとして残す(旧 src/app/page.tsx の代替。route.tsはpage.tsxと異なりroot
// layoutを必要としないため、layout.tsxを[locale]配下へ統合した後もこのファイルは独立して残せる)
export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/ja", request.url));
}
