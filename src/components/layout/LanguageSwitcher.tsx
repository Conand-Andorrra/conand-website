'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const languages = [
  { code: 'ca', label: 'CA', flag: '🇦🇩' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
] as const

const localesWithPrefix = ['es', 'en', 'fr']

type LanguageSwitcherProps = {
  locale: string
  className?: string
}

export function LanguageSwitcher({ locale, className }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const getBasePath = () => {
    for (const loc of localesWithPrefix) {
      if (pathname.startsWith(`/${loc}/`)) {
        return pathname.slice(loc.length + 1)
      }
      if (pathname === `/${loc}`) {
        return '/'
      }
    }
    return pathname
  }

  const buildLocalePath = (targetLocale: string) => {
    const basePath = getBasePath()
    if (targetLocale === 'ca') return basePath
    return `/${targetLocale}${basePath}`
  }

  const current = languages.find((l) => l.code === locale) || languages[0]

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-beige/70 transition-all hover:bg-white/5 hover:text-beige"
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="glass absolute top-full right-0 mt-2 min-w-[130px] rounded-xl p-1.5">
          {languages.map((lang) => (
            <a
              key={lang.code}
              href={buildLocalePath(lang.code)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-white/5',
                lang.code === locale
                  ? 'font-semibold text-turquoise'
                  : 'text-beige/70 hover:text-beige',
              )}
              onClick={() => setOpen(false)}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
