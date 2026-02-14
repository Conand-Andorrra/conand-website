'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type GalleryCloudProps = {
  images: string[]
}

export function GalleryCloud({ images }: GalleryCloudProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [loaded, setLoaded] = useState<Set<number>>(new Set())

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === 'Escape') setSelectedIndex(null)
      if (e.key === 'ArrowRight') setSelectedIndex((selectedIndex + 1) % images.length)
      if (e.key === 'ArrowLeft') setSelectedIndex((selectedIndex - 1 + images.length) % images.length)
    },
    [selectedIndex, images.length],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedIndex])

  const markLoaded = (index: number) => {
    setLoaded((prev) => new Set(prev).add(index))
  }

  // Assign aspect ratios in a repeating pattern to create visual variety
  const getAspectClass = (index: number) => {
    const patterns = [
      'aspect-[4/3]',
      'aspect-[3/4]',
      'aspect-square',
      'aspect-[4/3]',
      'aspect-[3/2]',
      'aspect-[3/4]',
      'aspect-[4/3]',
      'aspect-square',
      'aspect-[2/3]',
      'aspect-[4/3]',
    ]
    return patterns[index % patterns.length]
  }

  // Assign column span for some images to create the cloud effect
  const getSpanClass = (index: number) => {
    // Every 5th image spans 2 columns on large screens
    if (index % 7 === 0) return 'md:col-span-2'
    if (index % 11 === 0) return 'lg:col-span-2'
    return ''
  }

  return (
    <>
      {/* Masonry Cloud Grid */}
      <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
        {images.map((src, index) => (
          <div
            key={src}
            className={cn(
              'group relative mb-4 cursor-pointer overflow-hidden rounded-xl break-inside-avoid transition-all duration-500',
              loaded.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
            )}
            style={{ transitionDelay: `${Math.min(index * 60, 1500)}ms` }}
            onClick={() => setSelectedIndex(index)}
          >
            <div className={cn('relative w-full', getAspectClass(index))}>
              <Image
                src={src}
                alt={`CONAND Gallery ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onLoad={() => markLoaded(index)}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-0 flex items-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-8 rounded-full bg-turquoise" />
                  <span className="text-xs font-medium text-beige/80">CONAND</span>
                </div>
              </div>
              {/* Glow border on hover */}
              <div className="absolute inset-0 rounded-xl border border-turquoise/0 transition-all duration-300 group-hover:border-turquoise/30 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/95 backdrop-blur-xl"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-beige/70 transition-all hover:bg-white/20 hover:text-beige"
            onClick={() => setSelectedIndex(null)}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Navigation */}
          <button
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-beige/70 transition-all hover:bg-white/20 hover:text-beige md:left-8"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedIndex((selectedIndex - 1 + images.length) % images.length)
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-beige/70 transition-all hover:bg-white/20 hover:text-beige md:right-8"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedIndex((selectedIndex + 1) % images.length)
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Image */}
          <div
            className="relative mx-auto max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex]}
              alt={`CONAND Gallery ${selectedIndex + 1}`}
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto rounded-2xl object-contain"
              priority
            />
          </div>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-beige/60 backdrop-blur-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
