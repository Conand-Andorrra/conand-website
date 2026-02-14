import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, Twitter, Youtube, Twitch } from 'lucide-react'

type FooterProps = {
  locale: string
  t: Record<string, string>
  social: {
    linkedinUrl?: string | null
    twitterUrl?: string | null
    youtubeUrl?: string | null
    twitchUrl?: string | null
  }
}

function localePath(path: string, locale: string) {
  if (locale === 'ca') return path
  return `/${locale}${path}`
}

export function Footer({ locale, t, social }: FooterProps) {
  const socialLinks = [
    { icon: Linkedin, url: social.linkedinUrl, label: 'LinkedIn' },
    { icon: Twitter, url: social.twitterUrl, label: 'X / Twitter' },
    { icon: Youtube, url: social.youtubeUrl, label: 'YouTube' },
    { icon: Twitch, url: social.twitchUrl, label: 'Twitch' },
  ]

  return (
    <footer className="relative border-t border-white/5 bg-dark-blue">
      <div className="dot-pattern absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-[1280px] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href={localePath('/', locale)} className="mb-4 inline-block">
              <div className="relative h-14 w-44">
                <Image
                  src="/img/conandlogo.png"
                  alt="CONAND"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-beige/40">
              Andorra tech conference by the community, for the community.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 font-teko text-lg font-semibold uppercase tracking-wider text-beige/60">
              Navigation
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href={localePath('/', locale)}
                className="text-sm text-beige/50 transition-colors hover:text-turquoise"
              >
                {t.home}
              </Link>
              <Link
                href={localePath('/about', locale)}
                className="text-sm text-beige/50 transition-colors hover:text-turquoise"
              >
                {t.about}
              </Link>
              <Link
                href={localePath('/about#contact', locale)}
                className="text-sm text-beige/50 transition-colors hover:text-turquoise"
              >
                {t.contact}
              </Link>
            </nav>
          </div>

          {/* GDG Andorra */}
          <div>
            <h3 className="mb-4 font-teko text-lg font-semibold uppercase tracking-wider text-beige/60">
              Community
            </h3>
            <a
              href="https://gdg.community.dev/gdg-andorra/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <Image
                src="/img/logo_gdg.png"
                alt="GDG Andorra"
                width={56}
                height={44}
                className="shrink-0"
              />
              <span className="text-sm font-medium text-beige/50 transition-colors group-hover:text-turquoise">
                GDG Andorra
              </span>
            </a>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 font-teko text-lg font-semibold uppercase tracking-wider text-beige/60">
              {t.followUs}
            </h3>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, url, label }) =>
                url ? (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-beige/50 transition-all hover:bg-turquoise/20 hover:text-turquoise"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ) : null,
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative border-t border-white/5">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-5">
          <p className="text-xs text-beige/30">
            &copy; {new Date().getFullYear()} CONAND. All rights reserved.
          </p>
          <p className="text-xs text-beige/30">
            Made with &lt;3 in Andorra
          </p>
        </div>
      </div>
    </footer>
  )
}
