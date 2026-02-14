import { getPayload } from './payload'
import type { Event, Speaker, Sponsor, Media } from '../payload-types'

export async function getUpcomingEvents(locale: string = 'ca') {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'events',
    where: { status: { equals: 'upcoming' } },
    sort: 'date',
    locale: locale as 'ca' | 'es' | 'en' | 'fr',
    depth: 2,
  })
  return result.docs
}

export async function getPastEvents(locale: string = 'ca') {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'events',
    where: { status: { equals: 'past' } },
    sort: '-date',
    locale: locale as 'ca' | 'es' | 'en' | 'fr',
    depth: 2,
    limit: 100,
  })
  return result.docs
}

export async function getNextEvent(locale: string = 'ca') {
  const events = await getUpcomingEvents(locale)
  return events[0] || null
}

export async function getAllEvents(locale: string = 'ca') {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'events',
    sort: '-date',
    locale: locale as 'ca' | 'es' | 'en' | 'fr',
    depth: 2,
    limit: 100,
  })
  return result.docs
}

export async function getEventBySlug(year: string, slug: string, locale: string = 'ca') {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'events',
    where: {
      and: [
        { slug: { equals: slug } },
        { year: { equals: year } },
      ],
    },
    locale: locale as 'ca' | 'es' | 'en' | 'fr',
    depth: 2,
  })
  return result.docs[0] || null
}

export async function getGlobalSponsors() {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'sponsors',
    where: { isGlobal: { equals: true } },
    depth: 1,
    limit: 100,
  })
  return result.docs
}

export async function getSiteSettings(locale: string = 'ca') {
  const payload = await getPayload()
  return payload.findGlobal({
    slug: 'site-settings',
    locale: locale as 'ca' | 'es' | 'en' | 'fr',
    depth: 2,
  })
}

export async function getTranslations(locale: string = 'ca') {
  const payload = await getPayload()
  return payload.findGlobal({
    slug: 'translations',
    locale: locale as 'ca' | 'es' | 'en' | 'fr',
  })
}

// Helper to get media URL
export function getMediaUrl(media: Media | string | null | undefined): string {
  if (!media) return '/img/placeholder.svg'
  if (typeof media === 'string') return media
  return media.url || '/img/placeholder.svg'
}

export function getMediaAlt(media: Media | string | null | undefined): string {
  if (!media || typeof media === 'string') return ''
  return media.alt || ''
}

// Group sponsors by tier
export function groupSponsorsByTier(sponsors: Sponsor[]) {
  const tiers = ['platinum', 'gold', 'silver', 'bronze', 'collaborator'] as const
  const grouped: Record<string, Sponsor[]> = {}
  for (const tier of tiers) {
    const filtered = sponsors.filter((s) => s.tier === tier)
    if (filtered.length > 0) {
      grouped[tier] = filtered
    }
  }
  return grouped
}
