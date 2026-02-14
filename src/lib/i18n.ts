import ca from '../messages/ca.json'
import es from '../messages/es.json'
import en from '../messages/en.json'
import fr from '../messages/fr.json'

const messages: Record<string, Record<string, unknown>> = { ca, es, en, fr }

export const locales = ['ca', 'es', 'en', 'fr'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ca'

export function getMessages(locale: string) {
  return messages[locale] || messages.ca
}

// Get a nested translation value by dot path
export function t(locale: string, path: string): string {
  const msgs = getMessages(locale)
  const keys = path.split('.')
  let value: unknown = msgs
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key]
    } else {
      return path // fallback to the key itself
    }
  }
  return typeof value === 'string' ? value : path
}

// Format date with locale
export function formatDate(date: string | Date, locale: string, style: 'long' | 'short' = 'long') {
  const d = typeof date === 'string' ? new Date(date) : date
  const localeMap: Record<string, string> = {
    ca: 'ca-ES',
    es: 'es-ES',
    en: 'en-US',
    fr: 'fr-FR',
  }
  if (style === 'short') {
    return d.toLocaleDateString(localeMap[locale] || 'ca-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
  return d.toLocaleDateString(localeMap[locale] || 'ca-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Build locale-aware path
export function localePath(path: string, locale: string): string {
  if (locale === 'ca') return path
  return `/${locale}${path}`
}
