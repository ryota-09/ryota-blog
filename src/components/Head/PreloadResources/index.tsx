'use client'
import ReactDOM from 'react-dom'

// 記事データ・画像が共にリポジトリ格納方式(MDX+velite)へ移行したため、
// microCMS API/画像CDN(images.microcms-assets.io)へのpreconnectは完全に不要になった(#243)。
// フォントもnext/font/googleがビルド時にセルフホスト(/_next/static/media)するため、
// fonts.googleapis.com / fonts.gstatic.com へのpreconnectは不要(実測でリクエスト0件: Issue #223)。
const GTM_DOMAIN = 'https://www.googletagmanager.com'
const GA_DOMAIN = 'https://www.google-analytics.com'

const PreloadResources = () => {
  ReactDOM.preconnect(GTM_DOMAIN)
  ReactDOM.preconnect(GA_DOMAIN)
  ReactDOM.prefetchDNS(GTM_DOMAIN)
  return null
}
export default PreloadResources