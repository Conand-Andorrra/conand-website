import { ImageSlider } from './ImageSlider'
import { Countdown } from './Countdown'

type HeroSectionProps = {
  images: { url: string; alt: string }[]
  tagline?: string
  nextEventName?: string
  nextEventDate?: string
  primaryButton?: { text: string; url: string }
  secondaryButton?: { text: string; url: string }
  countdownLabels: {
    days: string
    hours: string
    minutes: string
    seconds: string
  }
}

export function HeroSection({
  images,
  tagline,
  nextEventName,
  nextEventDate,
  primaryButton,
  secondaryButton,
  countdownLabels,
}: HeroSectionProps) {
  const hasUpcomingEvent = !!nextEventDate

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      {/* Background slider */}
      <ImageSlider images={images} />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark-blue/70 to-dark" />

      {/* Dot pattern overlay */}
      <div className="dot-pattern absolute inset-0 opacity-20" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Title with gradient */}
        <h1 className="font-teko text-6xl font-bold md:text-8xl lg:text-9xl">
          <span className="text-beige">CON</span>
          <span className="gradient-text-warm">AND</span>
        </h1>

        {hasUpcomingEvent ? (
          <>
            {nextEventName && (
              <p className="mt-3 max-w-lg text-lg text-beige/60 md:text-xl">
                {nextEventName}
              </p>
            )}

            <div className="mt-10">
              <Countdown targetDate={nextEventDate} labels={countdownLabels} />
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {primaryButton?.url && (
                <a
                  href={primaryButton.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-xl bg-turquoise px-8 py-3.5 font-semibold text-dark transition-all hover:shadow-lg hover:shadow-turquoise/25"
                >
                  <span className="relative z-10">{primaryButton.text}</span>
                </a>
              )}
              {secondaryButton?.url && (
                <a
                  href={secondaryButton.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-orange/50 bg-orange/10 px-8 py-3.5 font-semibold text-orange transition-all hover:bg-orange/20 hover:shadow-lg hover:shadow-orange/15"
                >
                  {secondaryButton.text}
                </a>
              )}
            </div>
          </>
        ) : (
          tagline && (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-beige/50 md:text-xl">
              {tagline}
            </p>
          )
        )}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />
    </section>
  )
}
