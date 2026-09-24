'use client';
import { createContext, useContext } from 'react';
import defaults from '@/data/site-settings.json';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n';
export type SiteCopy = typeof defaults;
const SiteCopyContext = createContext<SiteCopy>(defaults);
const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);
export function useCopy() {
  return useContext(SiteCopyContext);
}
export function useLocale() {
  return useContext(LocaleContext);
}
export default function SiteCopyProvider({
  value,
  locale,
  children,
}: {
  value: SiteCopy;
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>
      <SiteCopyContext.Provider value={value}>{children}</SiteCopyContext.Provider>
    </LocaleContext.Provider>
  );
}
