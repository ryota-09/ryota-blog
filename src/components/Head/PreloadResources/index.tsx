'use client'
import ReactDOM from 'react-dom'

const IMAGE_DOMAIN = 'https://images.microcms-assets.io'
const PROJECT_ID = '4626924a681346e9a0fcabe5478eb9fa'

const PreloadResources = () => {
  ReactDOM.preconnect(`${IMAGE_DOMAIN}/assets/${PROJECT_ID}`, { crossOrigin: "anonymous" })
  ReactDOM.prefetchDNS(IMAGE_DOMAIN)
  return null
}
export default PreloadResources