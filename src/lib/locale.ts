import { headers } from 'next/headers'
import { locales, defaultLocale, type Locale } from './i18n'

/** Read the locale set by the middleware (server components only) */
export async function getLocale(): Promise<Locale> {
  const headersList = await headers()
  const locale = headersList.get('x-locale')
  if (locale && locales.includes(locale as Locale)) {
    return locale as Locale
  }
  return defaultLocale
}
