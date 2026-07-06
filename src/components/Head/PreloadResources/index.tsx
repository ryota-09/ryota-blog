'use client'
import ReactDOM from 'react-dom'
import { microCMSServiceDomain } from '@/config'

// 記事画像がリポジトリ格納方式(MDX+velite)へ移行したため、
// microCMS画像CDN(images.microcms-assets.io)へのpreconnect/prefetchDNSは不要になった(#237)。
// microCMS APIドメインへのpreconnectは記事データ取得(lib/microcms.ts)で引き続き使うため維持する。
const GTM_DOMAIN = 'https://www.googletagmanager.com'
const GA_DOMAIN = 'https://www.google-analytics.com'
const FONTS_API = 'https://fonts.googleapis.com'
const FONTS_GSTATIC = 'https://fonts.gstatic.com'

const PreloadResources = () => {
  ReactDOM.preconnect(GTM_DOMAIN)
  ReactDOM.preconnect(GA_DOMAIN)
  ReactDOM.preconnect(FONTS_API)
  ReactDOM.preconnect(FONTS_GSTATIC, { crossOrigin: "anonymous" })
  ReactDOM.preconnect(`https://${microCMSServiceDomain}.microcms.io`)
  ReactDOM.prefetchDNS(GTM_DOMAIN)
  return null
}
export default PreloadResources