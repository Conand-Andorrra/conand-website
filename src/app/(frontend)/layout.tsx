import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getSiteSettings, getAllEvents } from '@/lib/data'
import { t as translate } from '@/lib/i18n'
import { getLocale } from '@/lib/locale'

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()

  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null
  let events: { name: string; year: string; slug: string }[] = []

  try {
    settings = await getSiteSettings(locale)
    const allEvents = await getAllEvents(locale)
    events = allEvents.map((e) => ({ name: e.name, year: e.year, slug: e.slug }))
  } catch {
    // DB may not be initialized yet
  }

  const navT = {
    home: translate(locale, 'nav.home'),
    events: translate(locale, 'nav.events'),
    gallery: translate(locale, 'nav.gallery'),
    about: translate(locale, 'nav.about'),
    contact: translate(locale, 'nav.contact'),
  }

  const footerT = {
    home: translate(locale, 'nav.home'),
    gallery: translate(locale, 'nav.gallery'),
    about: translate(locale, 'nav.about'),
    contact: translate(locale, 'nav.contact'),
    followUs: translate(locale, 'home.followUs'),
  }

  return (
    <>
      <Header locale={locale} t={navT} events={events} />
      <main className="min-h-screen">{children}</main>
      <Footer
        locale={locale}
        t={footerT}
        social={{
          linkedinUrl: settings?.social?.linkedinUrl,
          twitterUrl: settings?.social?.twitterUrl,
          youtubeUrl: settings?.social?.youtubeUrl,
          twitchUrl: settings?.social?.twitchUrl,
        }}
      />
    </>
  )
}
