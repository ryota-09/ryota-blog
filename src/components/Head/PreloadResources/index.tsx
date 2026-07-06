'use client'
import ReactDOM from 'react-dom'

// 記事データ・画像が共にリポジトリ格納方式(MDX+velite)へ移行したため、
// microCMS API/画像CDN(images.microcms-assets.io)へのpreconnectは完全に不要になった(#243)。
const GTM_DOMAIN = 'https://www.googletagmanager.com'
const GA_DOMAIN = 'https://www.google-analytics.com'
const FONTS_API = 'https://fonts.googleapis.com'
const FONTS_GSTATIC = 'https://fonts.gstatic.com'

const PreloadResources = () => {
  ReactDOM.preconnect(GTM_DOMAIN)
  ReactDOM.preconnect(GA_DOMAIN)
  ReactDOM.preconnect(FONTS_API)
  ReactDOM.preconnect(FONTS_GSTATIC, { crossOrigin: "anonymous" })
  ReactDOM.prefetchDNS(GTM_DOMAIN)
  return null
}
export default PreloadResources