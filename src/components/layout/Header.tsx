'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, ChevronDown } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { cn } from '@/lib/utils'

type NavEvent = {
  name: string
  year: string
  slug: string
}

type HeaderProps = {
  locale: string
  t: Record<string, string>
  events?: NavEvent[]
}

function localePath(path: string, locale: string) {
  if (locale === 'ca') return path
  return `/${locale}${path}`
}

export function Header({ locale, t, events = [] }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [eventsOpen, setEventsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: t.home, href: localePath('/', locale) },
    { label: t.about, href: localePath('/about', locale) },
    { label: t.contact, href: localePath('/about#contact', locale) },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6">
        {/* Logo */}
        <Link href={localePath('/', locale)} className="relative h-12 w-40 shrink-0">
          <Image
            src="/img/conandlogo.png"
            alt="CONAND"
            fill
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href={localePath('/', locale)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-beige/70 transition-all hover:bg-white/5 hover:text-beige"
          >
            {t.home}
          </Link>

          {/* Events dropdown */}
          {events.length > 0 ? (
            <div className="relative">
              <button
                onClick={() => setEventsOpen(!eventsOpen)}
                onBlur={() => setTimeout(() => setEventsOpen(false), 200)}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-beige/70 transition-all hover:bg-white/5 hover:text-beige"
              >
                {t.events}
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', eventsOpen && 'rotate-180')} />
              </button>
              {eventsOpen && (
                <div className="glass absolute top-full left-0 mt-2 min-w-[240px] rounded-xl p-2">
                  {events.map((ev) => (
                    <Link
                      key={`${ev.year}-${ev.slug}`}
                      href={localePath(`/ev/${ev.year}/${ev.slug}`, locale)}
                      className="block rounded-lg px-4 py-2.5 text-sm text-beige/70 transition-colors hover:bg-white/5 hover:text-turquoise"
                      onClick={() => setEventsOpen(false)}
                    >
                      {ev.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <span className="rounded-lg px-4 py-2 text-sm font-medium text-beige/40 cursor-default">
              {t.events}
            </span>
          )}

          {navLinks.filter(l => l.label !== t.home).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-beige/70 transition-all hover:bg-white/5 hover:text-beige"
            >
              {link.label}
            </Link>
          ))}

          {/* GDG Andorra */}
          <a
            href="https://gdg.community.dev/gdg-andorra/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:bg-white/5"
          >
            <Image src="/img/logo_gdg.png" alt="GDG Andorra" width={40} height={32} className="shrink-0" />
            <span className="text-sm font-medium text-beige/70 transition-colors group-hover:text-beige">GDG</span>
          </a>

          <div className="mx-2 h-5 w-px bg-white/10" />

          {/* Language Switcher */}
          <LanguageSwitcher locale={locale} />
        </nav>

        {/* Mobile menu */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher locale={locale} />
          <Sheet>
            <SheetTrigger asChild>
              <button className="rounded-lg p-2 text-beige/70 transition-colors hover:bg-white/5 hover:text-beige" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="border-white/5 bg-dark-blue w-72">
              <nav className="mt-8 flex flex-col gap-2">
                <SheetClose asChild>
                  <Link
                    href={localePath('/', locale)}
                    className="rounded-lg px-4 py-3 text-lg font-medium text-beige/70 transition-colors hover:bg-white/5 hover:text-turquoise"
                  >
                    {t.home}
                  </Link>
                </SheetClose>

                {/* Events section */}
                {events.length > 0 && (
                  <>
                    <p className="px-4 pt-2 text-sm font-semibold uppercase tracking-wider text-beige/40">
                      {t.events}
                    </p>
                    {events.map((ev) => (
                      <SheetClose key={`${ev.year}-${ev.slug}`} asChild>
                        <Link
                          href={localePath(`/ev/${ev.year}/${ev.slug}`, locale)}
                          className="rounded-lg px-6 py-2.5 text-base text-beige/60 transition-colors hover:bg-white/5 hover:text-turquoise"
                        >
                          {ev.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </>
                )}

                <div className="section-divider mx-4 my-2" />

                {navLinks.filter(l => l.label !== t.home).map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className="rounded-lg px-4 py-3 text-lg font-medium text-beige/70 transition-colors hover:bg-white/5 hover:text-turquoise"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}

                {/* GDG Andorra mobile */}
                <div className="section-divider mx-4 my-2" />
                <SheetClose asChild>
                  <a
                    href="https://gdg.community.dev/gdg-andorra/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium text-beige/70 transition-colors hover:bg-white/5 hover:text-turquoise"
                  >
                    <Image src="/img/logo_gdg.png" alt="GDG" width={40} height={32} className="shrink-0" />
                    GDG Andorra
                  </a>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
