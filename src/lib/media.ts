import type { Media } from '../payload-types'

/** Get the URL of a media item, with fallback to placeholder */
export function getMediaUrl(media: Media | string | null | undefined): string {
  if (!media) return '/img/placeholder.svg'
  if (typeof media === 'string') return media
  return media.url || '/img/placeholder.svg'
}

/** Get the alt text of a media item */
export function getMediaAlt(media: Media | string | null | undefined): string {
  if (!media || typeof media === 'string') return ''
  return media.alt || ''
}
