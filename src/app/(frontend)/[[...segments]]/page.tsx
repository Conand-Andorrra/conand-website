import Link from 'next/link'
import { HeroSection } from '@/components/sections/HeroSection'
import { SaveTheDate } from '@/components/sections/SaveTheDate'
import { EventCard } from '@/components/sections/EventCard'
import { getNextEvent, getUpcomingEvents, getPastEvents, getSiteSettings } from '@/lib/data'
import { t as translate, formatDate } from '@/lib/i18n'
import { getLocale } from '@/lib/locale'
import type { Media } from '@/payload-types'
import { getMediaUrl, getMediaAlt } from '@/lib/media'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const locale = await getLocale()
  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null
  let nextEvent: Awaited<ReturnType<typeof getNextEvent>> | null = null
  let upcomingEvents: Awaited<ReturnType<typeof getUpcomingEvents>> = []
  let pastEvents: Awaited<ReturnType<typeof getPastEvents>> = []

  try {
    ;[settings, nextEvent, upcomingEvents, pastEvents] = await Promise.all([
      getSiteSettings(locale),
      getNextEvent(locale),
      getUpcomingEvents(locale),
      getPastEvents(locale),
    ])
  } catch {
    // DB may not be initialized yet
  }

  const heroImages = settings?.hero?.heroImages?.length
    ? settings.hero.heroImages.map((item) => ({
        url: getMediaUrl(item.image as Media),
        alt: getMediaAlt(item.image as Media) || 'CONAND',
      }))
    : [
        { url: '/img/conand_2_img7_opt.png', alt: 'CONAND' },
        { url: '/img/conand_2_img8_opt.png', alt: 'CONAND' },
        { url: '/img/conand_1_img4_opt.png', alt: 'CONAND' },
        { url: '/img/conand_1_img5_opt.png', alt: 'CONAND' },
        { url: '/img/conand_1_img6_opt.png', alt: 'CONAND' },
      ]

  const eventCardT = {
    callForPapers: translate(locale, 'buttons.callForPapers'),
    tickets: translate(locale, 'buttons.tickets'),
    learnMore: translate(locale, 'buttons.learnMore'),
  }

  return (
    <>
      {/* Hero */}
      <HeroSection
        images={heroImages}
        tagline="Andorra tech conference by the community, for the community."
        nextEventName={nextEvent?.name}
        nextEventDate={nextEvent?.date}
        cfpButton={
          nextEvent?.actionButtons?.callForPapersEnabled && nextEvent.actionButtons.callForPapersUrl
            ? { text: translate(locale, 'buttons.callForPapers'), url: nextEvent.actionButtons.callForPapersUrl }
            : undefined
        }
        ticketsButton={
          nextEvent?.actionButtons?.ticketsEnabled && nextEvent.actionButtons.ticketsUrl
            ? { text: translate(locale, 'buttons.tickets'), url: nextEvent.actionButtons.ticketsUrl }
            : undefined
        }
        countdownLabels={{
          days: translate(locale, 'countdown.days'),
          hours: translate(locale, 'countdown.hours'),
          minutes: translate(locale, 'countdown.minutes'),
          seconds: translate(locale, 'countdown.seconds'),
        }}
      />

      {/* Save the Date */}
      {nextEvent && (
        <SaveTheDate
          label={translate(locale, 'home.saveTheDate')}
          dateFormatted={formatDate(nextEvent.date, locale)}
          eventName={nextEvent.name}
        />
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section id="events" className="relative py-24">
          <div className="dot-pattern absolute inset-0 opacity-10" />
          <div className="relative mx-auto max-w-[1280px] px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-turquoise">
                {translate(locale, 'home.nextEvent')}
              </p>
              <h2 className="font-teko text-4xl font-bold text-beige md:text-5xl">
                {translate(locale, 'home.nextEvent')}
              </h2>
              <div className="section-divider mx-auto mt-4 max-w-xs" />
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  locale={locale}
                  t={eventCardT}
                  dateFormatted={formatDate(event.date, locale, 'short')}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="relative border-t border-white/5 py-24">
          <div className="relative mx-auto max-w-[1280px] px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-orange">
                {translate(locale, 'event.pastEvent')}
              </p>
              <h2 className="font-teko text-4xl font-bold text-beige md:text-5xl">
                {translate(locale, 'event.pastEvent')}
              </h2>
              <div className="section-divider mx-auto mt-4 max-w-xs" />
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  locale={locale}
                  t={eventCardT}
                  dateFormatted={formatDate(event.date, locale, 'short')}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What is CONAND + GDG */}
      <section className="relative border-t border-white/5 py-24">
        <div className="dot-pattern absolute inset-0 opacity-10" />
        <div className="relative mx-auto max-w-[1280px] px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-turquoise">
              {translate(locale, 'home.whatIsConand')}
            </p>
            <h2 className="font-teko text-4xl font-bold text-beige md:text-5xl">
              CONAND
            </h2>
            <div className="section-divider mx-auto mt-4 max-w-xs" />
            <p className="mt-8 text-lg leading-relaxed text-beige/60">
              {translate(locale, 'home.conandDescription')}
            </p>
          </div>

          {/* GDG */}
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="glass rounded-2xl p-8 text-center md:p-10">
              <div className="relative mx-auto mb-5 h-16 w-16">
                <Image src="/img/logo_gdg.png" alt="GDG" fill className="object-contain" />
              </div>
              <h3 className="mb-3 font-teko text-2xl font-bold text-beige md:text-3xl">
                {translate(locale, 'home.gdgTitle')}
              </h3>
              <p className="mb-6 leading-relaxed text-beige/60">
                {translate(locale, 'home.gdgDescription')}
              </p>
              <Link
                href="https://gdg.community.dev/gdg-andorra/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-turquoise px-6 py-3 font-semibold text-dark transition-all hover:shadow-lg hover:shadow-turquoise/25"
              >
                GDG Andorra
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
