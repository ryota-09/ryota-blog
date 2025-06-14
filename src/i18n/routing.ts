import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // All locales that are supported
  locales: ['ja', 'en'],
  
  // Used when no locale matches
  defaultLocale: 'ja'
});

// Export for backwards compatibility
export const { locales, defaultLocale } = routing;