export const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3006"

export const microCMSServiceDomain = process.env.MICROCMS_SERVICE_DOMAIN || ""
export const microCMSAPIKey = process.env.MICROCMS_API_KEY || ""

export const gtmId = process.env.NEXT_PUBLIC_GTM_ID || ""
export const gaId = process.env.NEXT_PUBLIC_GA_ID || ""

// AWS RUM
export const gustRoleArn = process.env.NEXT_PUBLIC_GUEST_ROLE_ARN || ""
export const identityPoolId = process.env.NEXT_PUBLIC_IDENTITY_POOL_ID || ""
export const applicationId = process.env.NEXT_PUBLIC_APPLICATION_ID || ""