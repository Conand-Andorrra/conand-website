'use client'

import { useCallback, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'

type ImageSliderProps = {
  images: { url: string; alt: string }[]
}

export function ImageSlider({ images }: ImageSliderProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5500, stopOnInteraction: false }),
  ])

  if (images.length === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
      <div className="flex h-full">
        {images.map((img, i) => (
          <div key={i} className="relative min-w-0 flex-[0_0_100%]">
            <Image
              src={img.url}
              alt={img.alt}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
