'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Speaker, Media } from '@/payload-types'
import { getMediaUrl, getMediaAlt } from '@/lib/media'

type SpeakerCardProps = {
  speaker: Speaker
}

export function SpeakerCard({ speaker }: SpeakerCardProps) {
  const [open, setOpen] = useState(false)
  const photoUrl = getMediaUrl(speaker.photo as Media)
  const photoAlt = getMediaAlt(speaker.photo as Media)
  const bioText = extractPlainText(speaker.bio)

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="glass group cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/15"
      >
        {/* Photo */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={photoUrl}
            alt={photoAlt || speaker.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-blue/80 to-transparent" />
        </div>
        {/* Info */}
        <div className="p-4">
          <h3 className="font-teko text-xl font-semibold text-beige">{speaker.name}</h3>
          <p className="text-sm text-turquoise">{speaker.title}</p>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass max-w-lg border-white/10 bg-dark-blue text-beige">
          <DialogHeader>
            <DialogTitle className="font-teko text-2xl text-beige">{speaker.name}</DialogTitle>
            <p className="text-turquoise">{speaker.title}</p>
          </DialogHeader>
          <div className="relative mb-4 h-64 overflow-hidden rounded-xl">
            <Image
              src={photoUrl}
              alt={photoAlt || speaker.name}
              fill
              className="object-cover"
              sizes="500px"
            />
          </div>
          {bioText && <p className="text-sm leading-relaxed text-beige/70">{bioText}</p>}
        </DialogContent>
      </Dialog>
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
