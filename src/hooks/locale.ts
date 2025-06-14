'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { type Locale } from '@/i18n/config';

export const useLocalePreference = () => {
  const currentLocale = useLocale() as Locale;
  const [preferredLocale, setPreferredLocale] = useState<Locale>(currentLocale);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem('preferred-locale') as Locale | null;
    if (saved) {
      setPreferredLocale(saved);
    }
  }, []);

  const saveLocalePreference = (locale: Locale) => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('preferred-locale', locale);
    setPreferredLocale(locale);
  };

  const getPreferredLocale = (): Locale | null => {
    if (typeof window === 'undefined') return null;
    
    return localStorage.getItem('preferred-locale') as Locale | null;
  };

  return {
    preferredLocale,
    saveLocalePreference,
    getPreferredLocale,
    currentLocale
  };
};