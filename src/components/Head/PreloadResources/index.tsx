'use client'
import ReactDOM from 'react-dom'
import { microCMSServiceDomain } from '@/config'

const IMAGE_DOMAIN = 'https://images.microcms-assets.io'
const PROJECT_ID = '4626924a681346e9a0fcabe5478eb9fa'
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
  ReactDOM.preconnect(IMAGE_DOMAIN, { crossOrigin: "anonymous" })
  ReactDOM.preconnect(`${IMAGE_DOMAIN}/assets/${PROJECT_ID}`, { crossOrigin: "anonymous" })
  ReactDOM.prefetchDNS(GTM_DOMAIN)
  ReactDOM.prefetchDNS(IMAGE_DOMAIN)
  return null
}
export default PreloadResources