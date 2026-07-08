'use client'
import ReactDOM from 'react-dom'

// 記事データ・画像が共にリポジトリ格納方式(MDX+velite)へ移行したため、
// microCMS API/画像CDN(images.microcms-assets.io)へのpreconnectは完全に不要になった(#243)。
// フォント本体はGoogle CDN(fonts.gstatic.com)のバージョン固定URLから非同期取得する方式に
// 移行したため(render-blocking解消: src/app/layout.tsx参照)、gstaticへのpreconnectは必要。
// fonts.googleapis.com はCSSを静的ファイル化したので接続不要のまま。
const GTM_DOMAIN = 'https://www.googletagmanager.com'
const GA_DOMAIN = 'https://www.google-analytics.com'
const FONTS_GSTATIC = 'https://fonts.gstatic.com'

const PreloadResources = () => {
  ReactDOM.preconnect(GTM_DOMAIN)
  ReactDOM.preconnect(GA_DOMAIN)
  ReactDOM.preconnect(FONTS_GSTATIC, { crossOrigin: "anonymous" })
  ReactDOM.prefetchDNS(GTM_DOMAIN)
  return null
}
export default PreloadResources