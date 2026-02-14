import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ArrowLeft, Mic, Ticket } from 'lucide-react'
import { SpeakerCard } from '@/components/sections/SpeakerCard'
import { ScheduleView } from '@/components/sections/ScheduleView'
import { SponsorsGrid } from '@/components/sections/SponsorsGrid'
import { getEventBySlug } from '@/lib/data'
import { t as translate, formatDate } from '@/lib/i18n'
import { getLocale } from '@/lib/locale'
import { getMediaUrl } from '@/lib/media'
import type { Media, Speaker, Sponsor } from '@/payload-types'

type Props = {
  params: Promise<{ year: string; slug: string }>
}

export default async function EventPage({ params }: Props) {
  const locale = await getLocale()
  const { year, slug } = await params
  const event = await getEventBySlug(year, slug, locale)

  if (!event) notFound()

  const imageUrl = getMediaUrl(event.featuredImage as Media)
  const isUpcoming = event.status === 'upcoming'

  const speakers = (event.speakers || []).filter(
    (s): s is Speaker => typeof s === 'object' && s !== null && 'name' in s,
  )

  const days = event.schedule?.days || []
  const tracks = event.schedule?.tracks || []
  const sessions = (event.schedule?.sessions || []).map((s) => ({
    ...s,
    sessionTitle: s.sessionTitle || '',
    startTime: s.startTime || '',
    endTime: s.endTime || '',
    dayIndex: s.dayIndex ?? 0,
    trackIndex: s.trackIndex ?? 0,
  }))

  const eventSponsors: Sponsor[] = []
  for (const item of event.eventSponsors || []) {
    if (typeof item.sponsor === 'object' && item.sponsor !== null && 'name' in item.sponsor) {
      const sponsor = { ...item.sponsor } as Sponsor
      if (item.tierOverride) {
        sponsor.tier = item.tierOverride as Sponsor['tier']
      }
      eventSponsors.push(sponsor)
    }
  }

  const descriptionText = extractPlainText(event.description)

  const tierLabels: Record<string, string> = {
    platinum: translate(locale, 'tier.platinum'),
    gold: translate(locale, 'tier.gold'),
    silver: translate(locale, 'tier.silver'),
    bronze: translate(locale, 'tier.bronze'),
    collaborator: translate(locale, 'tier.collaborator'),
  }

  return (
    <>
      {/* Event Hero */}
      <section className="relative flex min-h-screen items-end overflow-hidden pb-20 pt-32">
        <Image
          src={imageUrl}
          alt={event.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark-blue/80 to-dark/60" />
        <div className="dot-pattern absolute inset-0 opacity-10" />

        <div className="relative z-10 mx-auto max-w-[1280px] px-6">
          <Link
            href={locale === 'ca' ? '/' : `/${locale}`}
            className="mb-8 inline-flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-beige/60 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-beige"
          >
            <ArrowLeft className="h-4 w-4" />
            {translate(locale, 'event.back')}
          </Link>

          <div className="mb-5">
            <span
              className={`inline-block rounded-lg px-3 py-1.5 text-xs font-semibold ${
                isUpcoming
                  ? 'bg-turquoise/20 text-turquoise'
                  : 'bg-white/10 text-beige/60'
              }`}
            >
              {isUpcoming
                ? translate(locale, 'event.upcomingEvent')
                : translate(locale, 'event.pastEvent')}
            </span>
          </div>

          <div className="mb-4 flex items-center gap-2 text-beige/50">
            <Calendar className="h-5 w-5 text-orange" />
            <span className="capitalize">{formatDate(event.date, locale)}</span>
          </div>

          <h1 className="mb-5 font-teko text-4xl font-bold text-beige md:text-6xl lg:text-7xl">
            {event.name}
          </h1>

          {descriptionText && (
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-beige/50">{descriptionText}</p>
          )}

          {isUpcoming && (event.actionButtons?.callForPapersEnabled || event.actionButtons?.ticketsEnabled) && (
            <div className="flex flex-wrap gap-4">
              {event.actionButtons?.callForPapersEnabled && event.actionButtons.callForPapersUrl && (
                <a
                  href={event.actionButtons.callForPapersUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-turquoise px-8 py-3.5 font-semibold text-dark transition-all hover:shadow-lg hover:shadow-turquoise/25"
                >
                  <Mic className="h-4 w-4" />
                  {translate(locale, 'buttons.callForPapers')}
                </a>
              )}
              {event.actionButtons?.ticketsEnabled && event.actionButtons.ticketsUrl && (
                <a
                  href={event.actionButtons.ticketsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-orange/50 bg-orange/10 px-8 py-3.5 font-semibold text-orange transition-all hover:bg-orange/20 hover:shadow-lg hover:shadow-orange/15"
                >
                  <Ticket className="h-4 w-4" />
                  {translate(locale, 'buttons.tickets')}
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Speakers */}
      {speakers.length > 0 && (
        <section className="relative border-t border-white/5 py-24">
          <div className="dot-pattern absolute inset-0 opacity-10" />
          <div className="relative mx-auto max-w-[1280px] px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-turquoise">
                {translate(locale, 'event.speakers')}
              </p>
              <h2 className="font-teko text-4xl font-bold text-beige md:text-5xl">
                {translate(locale, 'event.speakers')}
              </h2>
              <div className="section-divider mx-auto mt-4 max-w-xs" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {speakers.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Schedule */}
      {sessions.length > 0 && (
        <section className="relative border-t border-white/5 py-24">
          <div className="relative mx-auto max-w-[1280px] px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-orange">
                {translate(locale, 'event.schedule')}
              </p>
              <h2 className="font-teko text-4xl font-bold text-beige md:text-5xl">
                {translate(locale, 'event.schedule')}
              </h2>
              <div className="section-divider mx-auto mt-4 max-w-xs" />
            </div>
            <ScheduleView
              days={days.map((d) => ({ dayDate: d.dayDate, id: d.id }))}
              tracks={tracks.map((t) => ({ trackName: t.trackName, id: t.id }))}
              sessions={sessions}
              dayLabel={translate(locale, 'event.day')}
              locale={locale}
            />
          </div>
        </section>
      )}

      {/* Event Sponsors */}
      {eventSponsors.length > 0 && (
        <section className="relative border-t border-white/5 py-24">
          <div className="dot-pattern absolute inset-0 opacity-10" />
          <div className="relative mx-auto max-w-[1280px] px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-turquoise">
                {translate(locale, 'event.sponsorsTitle')}
              </p>
              <h2 className="font-teko text-4xl font-bold text-beige md:text-5xl">
                {translate(locale, 'event.sponsorsTitle')}
              </h2>
              <div className="section-divider mx-auto mt-4 max-w-xs" />
            </div>
            <SponsorsGrid sponsors={eventSponsors} tierLabels={tierLabels} />
          </div>
        </section>
      )}
    </>
  )
}

function extractPlainText(richText: unknown): string {
  if (!richText) return ''
  if (typeof richText === 'string') return richText
  if (typeof richText === 'object' && richText !== null && 'root' in richText) {
    const root = (richText as { root: { children: unknown[] } }).root
    return extractChildren(root.children)
  }
  return ''
}

function extractChildren(children: unknown[]): string {
  if (!Array.isArray(children)) return ''
  return children
    .map((child: unknown) => {
      if (!child || typeof child !== 'object') return ''
      const c = child as Record<string, unknown>
      if (c.text && typeof c.text === 'string') return c.text
      if (Array.isArray(c.children)) return extractChildren(c.children)
      return ''
    })
    .join(' ')
    .trim()
}
