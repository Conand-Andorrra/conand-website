import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ArrowRight, Ticket, Mic } from 'lucide-react'
import type { Event, Media } from '@/payload-types'
import { getMediaUrl, getMediaAlt } from '@/lib/media'

type EventCardProps = {
  event: Event
  locale: string
  t: {
    callForPapers: string
    tickets: string
    learnMore: string
  }
  dateFormatted: string
}

function localePath(path: string, locale: string) {
  if (locale === 'ca') return path
  return `/${locale}${path}`
}

export function EventCard({ event, locale, t, dateFormatted }: EventCardProps) {
  const imageUrl = getMediaUrl(event.featuredImage as Media)
  const imageAlt = getMediaAlt(event.featuredImage as Media)
  const eventPath = localePath(`/ev/${event.year}/${event.slug}`, locale)
  const descriptionText = extractPlainText(event.description)
  const isUpcoming = event.status === 'upcoming'

  return (
    <div className="glass group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/15">
      {/* Image */}
      <Link href={eventPath} className="relative block h-52 overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt || event.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-blue/80 to-transparent" />
        {isUpcoming && (
          <div className="absolute top-3 right-3 rounded-lg bg-turquoise/90 px-2.5 py-1 text-xs font-semibold text-dark backdrop-blur-sm">
            UPCOMING
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3 flex items-center gap-2 text-sm text-orange">
          <Calendar className="h-3.5 w-3.5" />
          <span className="capitalize">{dateFormatted}</span>
        </div>
        <h3 className="mb-2 font-teko text-xl font-semibold text-beige">
          <Link href={eventPath} className="transition-colors hover:text-turquoise">
            {event.name}
          </Link>
        </h3>
        {descriptionText && (
          <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-beige/50">{descriptionText}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {event.actionButtons?.callForPapersEnabled && event.actionButtons.callForPapersUrl && (
            <a
              href={event.actionButtons.callForPapersUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-turquoise/10 px-3 py-1.5 text-xs font-semibold text-turquoise transition-colors hover:bg-turquoise/20"
            >
              <Mic className="h-3 w-3" />
              {t.callForPapers}
            </a>
          )}
          {event.actionButtons?.ticketsEnabled && event.actionButtons.ticketsUrl && (
            <a
              href={event.actionButtons.ticketsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-orange/10 px-3 py-1.5 text-xs font-semibold text-orange transition-colors hover:bg-orange/20"
            >
              <Ticket className="h-3 w-3" />
              {t.tickets}
            </a>
          )}
          <Link
            href={eventPath}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-beige/60 transition-all hover:border-white/20 hover:text-beige"
          >
            {t.learnMore}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
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
