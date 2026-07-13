'use client'
import ReactDOM from 'react-dom'

// 記事データ・画像が共にリポジトリ格納方式(MDX+velite)へ移行したため、
// microCMS API/画像CDN(images.microcms-assets.io)へのpreconnectは完全に不要になった(#243)。
// フォントもサブセット自己ホスト化(scripts/generate-font-subset.mjs参照)で同一オリジン配信に
// なったため、fonts.gstatic.com へのpreconnectも不要になり撤去した。
const GTM_DOMAIN = 'https://www.googletagmanager.com'
const GA_DOMAIN = 'https://www.google-analytics.com'

const PreloadResources = () => {
  ReactDOM.preconnect(GTM_DOMAIN)
  ReactDOM.preconnect(GA_DOMAIN)
  ReactDOM.prefetchDNS(GTM_DOMAIN)
  return null
}
export default PreloadResources