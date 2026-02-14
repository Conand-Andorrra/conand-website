import Image from 'next/image'
import { getSiteSettings } from '@/lib/data'
import { t as translate } from '@/lib/i18n'
import { getLocale } from '@/lib/locale'
import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/lib/media'
import { Mail } from 'lucide-react'
import { ContactForm } from '@/components/sections/ContactForm'

export default async function AboutPage() {
  const locale = await getLocale()
  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null

  try {
    settings = await getSiteSettings(locale)
  } catch {
    // DB may not be initialized yet
  }

  const aboutText = extractPlainText(settings?.about?.aboutText)
  const aboutParagraphs = aboutText
    ? aboutText.split(/\n\n|\n/).filter(Boolean)
    : [
        "CONAND va néixer com una conferència de ciberseguretat a Andorra. Després de diversos anys de pausa, reneix amb un enfocament més ampli: impulsar la comunitat tecnològica local mitjançant meetups, una gran conferència anual i esdeveniments oberts per compartir coneixement.",
        "Ara, CONAND busca connectar professionals, estudiants i entusiastes del sector mitjançant iniciatives inclusives i accessibles. Tots els esdeveniments són organitzats per i per a la comunitat, i compten amb el suport de patrocinadors que creuen en el poder de la col·laboració.",
        "El contingut de CONAND abasta des del desenvolupament de programari fins a la intel·ligència artificial, el disseny digital i la transformació tecnològica. Cada activitat està pensada per aportar valor real, sense importar el nivell d'experiència o l'àrea d'especialització.",
        "Més enllà de les xerrades, CONAND promou relacions autèntiques entre assistents. Les sessions de networking i les trobades socials han donat lloc a noves idees, projectes i col·laboracions. CONAND significa Conference Andorra, però sobretot, significa comunitat.",
      ]

  const aboutImg1 = settings?.about?.aboutImage1
    ? getMediaUrl(settings.about.aboutImage1 as Media)
    : '/img/conand_0_img1_opt.jpg'
  const aboutImg2 = settings?.about?.aboutImage2
    ? getMediaUrl(settings.about.aboutImage2 as Media)
    : '/img/conand_0_img2_opt.jpg'

  const contactT = {
    name: translate(locale, 'contact.name'),
    email: translate(locale, 'contact.email'),
    subject: translate(locale, 'contact.subject'),
    message: translate(locale, 'contact.message'),
    send: translate(locale, 'contact.send'),
    sending: translate(locale, 'contact.sending'),
    success: translate(locale, 'contact.success'),
    error: translate(locale, 'contact.error'),
    namePlaceholder: translate(locale, 'contact.namePlaceholder'),
    emailPlaceholder: translate(locale, 'contact.emailPlaceholder'),
    subjectPlaceholder: translate(locale, 'contact.subjectPlaceholder'),
    messagePlaceholder: translate(locale, 'contact.messagePlaceholder'),
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="dot-pattern absolute inset-0 opacity-10" />
        <div className="relative mx-auto max-w-[1280px] px-6 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-turquoise">
            {translate(locale, 'home.aboutTitle')}
          </p>
          <h1 className="font-teko text-5xl font-bold text-beige md:text-6xl lg:text-7xl">
            {translate(locale, 'home.aboutTitle')}
          </h1>
          <div className="section-divider mx-auto mt-4 max-w-xs" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-beige/50">
            Andorra tech conference by the community, for the community.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="relative border-t border-white/5 py-24">
        <div className="relative mx-auto max-w-[1280px] px-6">
          {/* Row 1: Text left, Image right */}
          <div className="mb-16 grid items-center gap-10 md:grid-cols-2">
            <div className="space-y-5">
              {aboutParagraphs.slice(0, 2).map((p, i) => (
                <p key={i} className="leading-relaxed text-beige/60">{p}</p>
              ))}
            </div>
            <div className="glass relative aspect-video overflow-hidden rounded-2xl">
              <Image src={aboutImg1} alt="CONAND" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>

          {/* Row 2: Image left, Text right */}
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="glass relative aspect-video overflow-hidden rounded-2xl md:order-first">
              <Image src={aboutImg2} alt="CONAND" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="space-y-5">
              {aboutParagraphs.slice(2, 4).map((p, i) => (
                <p key={i} className="leading-relaxed text-beige/60">{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative border-t border-white/5 py-24">
        <div className="relative mx-auto max-w-[1280px] px-6">
          <div className="glass mx-auto max-w-2xl rounded-3xl p-8 md:p-12">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-turquoise/10">
                <Mail className="h-7 w-7 text-turquoise" />
              </div>
              <h2 className="mb-3 font-teko text-3xl font-bold text-beige md:text-4xl">
                {translate(locale, 'home.contactTitle')}
              </h2>
              <p className="text-beige/50">
                {translate(locale, 'home.contactText')}
              </p>
            </div>
            <ContactForm t={contactT} />
          </div>
        </div>
      </section>
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
    .join('\n\n')
    .trim()
}
