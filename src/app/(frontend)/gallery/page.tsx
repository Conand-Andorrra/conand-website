import { GalleryCloud } from '@/components/sections/GalleryCloud'
import { t as translate } from '@/lib/i18n'
import { getLocale } from '@/lib/locale'
import { Camera } from 'lucide-react'
import fs from 'fs'
import path from 'path'

function getGalleryImages(): string[] {
  const dir = path.join(process.cwd(), 'public', 'img', 'galeria')
  try {
    const files = fs.readdirSync(dir)
    return files
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort(() => 0.5 - Math.random()) // Shuffle for variety
      .map((f) => `/img/galeria/${f}`)
  } catch {
    return []
  }
}

export default async function GalleryPage() {
  const locale = await getLocale()
  const images = getGalleryImages()

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="dot-pattern absolute inset-0 opacity-10" />
        <div className="relative mx-auto max-w-[1280px] px-6 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-turquoise/10">
            <Camera className="h-7 w-7 text-turquoise" />
          </div>
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-turquoise">
            {translate(locale, 'gallery.subtitle')}
          </p>
          <h1 className="font-teko text-5xl font-bold text-beige md:text-6xl lg:text-7xl">
            {translate(locale, 'gallery.title')}
          </h1>
          <div className="section-divider mx-auto mt-4 max-w-xs" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-beige/50">
            {translate(locale, 'gallery.description')}
          </p>
        </div>
      </section>

      {/* Gallery Cloud */}
      <section className="relative border-t border-white/5 py-16">
        <div className="relative mx-auto max-w-[1400px] px-4 md:px-6">
          {images.length > 0 ? (
            <GalleryCloud images={images} />
          ) : (
            <div className="glass mx-auto max-w-md rounded-2xl p-10 text-center">
              <Camera className="mx-auto mb-4 h-10 w-10 text-beige/30" />
              <p className="text-beige/50">{translate(locale, 'gallery.noImages')}</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
