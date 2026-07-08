export const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3006"

export const gtmId = process.env.NEXT_PUBLIC_GTM_ID || ""
// NOTE: gaId(NEXT_PUBLIC_GA_ID)はGA4をGTM経由に一本化(#222)した際に未使用となり削除した