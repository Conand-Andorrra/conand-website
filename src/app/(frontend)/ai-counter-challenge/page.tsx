import React from 'react'
import { Sparkles, Trophy, Gift, Clock } from 'lucide-react'
import { getNextEvent } from '@/lib/data'
import { t as translate, formatDate } from '@/lib/i18n'
import { getLocale } from '@/lib/locale'
import type { Speaker } from '@/payload-types'
import { AiCounterChallengeClient } from './AiCounterChallengeClient'

export const metadata = {
  title: 'AI Counter Challenge - CONAND',
  description:
    'Guess how many times AI / Artificial Intelligence will be mentioned during the event and win a prize.',
}

export default async function AiCounterChallengePage() {
  const locale = await getLocale()

  let event: Awaited<ReturnType<typeof getNextEvent>> | null = null
  try {
    event = await getNextEvent(locale)
  } catch {
    // DB may not be initialized yet
  }

  const speakersById = new Map<number | string, Speaker>()
  if (event?.speakers) {
    for (const s of event.speakers) {
      if (typeof s === 'object' && s !== null && 'name' in s) {
        speakersById.set(s.id, s as Speaker)
      }
    }
  }

  const talks = (event?.schedule?.sessions || [])
    .map((s) => {
      const speakerRef = s.sessionSpeaker
      let speakerName: string | null = null
      if (typeof speakerRef === 'object' && speakerRef !== null && 'name' in speakerRef) {
        speakerName = (speakerRef as Speaker).name
      } else if (typeof speakerRef === 'number' || typeof speakerRef === 'string') {
        const sp = speakersById.get(speakerRef)
        speakerName = sp?.name || null
      }
      // Stable id based on schedule position + start time. Do NOT use s.id
      // because the entrypoint re-seeds the database on every container start
      // and Payload generates a fresh array-item id each time, so any value
      // stored as perTalkGuesses[s.id] becomes orphaned on the next deploy.
      // dayIndex+trackIndex+startTime is stable as long as the schedule
      // structure is not edited.
      return {
        id: `d${s.dayIndex ?? 0}-t${s.trackIndex ?? 0}-${s.startTime || ''}`,
        title: s.sessionTitle || '',
        startTime: s.startTime || '',
        endTime: s.endTime || '',
        speakerName,
      }
    })
    // Solo charlas reales: las que tienen ponente asignado
    // (descarta pausa-café, dinar, cloenda, etc.)
    .filter((t) => t.title && t.speakerName)

  const rules = [
    translate(locale, 'aiChallenge.rule1'),
    translate(locale, 'aiChallenge.rule2'),
    translate(locale, 'aiChallenge.rule3'),
    translate(locale, 'aiChallenge.rule4'),
  ]

  // Deadline: 23:59:59.999 on the day of the event (event timezone — uses ISO date part).
  // Event date format is ISO, e.g. "2026-11-15T09:00:00.000Z".
  // We take just the YYYY-MM-DD portion so the deadline is "that day at 23:59" in the
  // attendee's local time (good enough for an Andorra-based audience).
  const deadlineISO = event?.date
    ? `${String(event.date).slice(0, 10)}T23:59:59.999`
    : null
  const deadlineDate = deadlineISO ? new Date(deadlineISO) : null
  const isClosed = deadlineDate ? new Date() > deadlineDate : false
  const deadlineLabel = deadlineDate
    ? `${formatDate(deadlineDate, locale, 'short')} · 23:59`
    : null

  const clientT = {
    signInTitle: translate(locale, 'aiChallenge.signInTitle'),
    signInDescription: translate(locale, 'aiChallenge.signInDescription'),
    signInGoogle: translate(locale, 'aiChallenge.signInGoogle'),
    signOut: translate(locale, 'aiChallenge.signOut'),
    signedInAs: translate(locale, 'aiChallenge.signedInAs'),
    totalGuess: translate(locale, 'aiChallenge.totalGuess'),
    totalGuessHelp: translate(locale, 'aiChallenge.totalGuessHelp'),
    perTalkGuess: translate(locale, 'aiChallenge.perTalkGuess'),
    perTalkHelp: translate(locale, 'aiChallenge.perTalkHelp'),
    submit: translate(locale, 'aiChallenge.submit'),
    update: translate(locale, 'aiChallenge.update'),
    saving: translate(locale, 'aiChallenge.saving'),
    saved: translate(locale, 'aiChallenge.saved'),
    errorSaving: translate(locale, 'aiChallenge.errorSaving'),
    errorSignIn: translate(locale, 'aiChallenge.errorSignIn'),
    yourGuess: translate(locale, 'aiChallenge.yourGuess'),
    loading: translate(locale, 'aiChallenge.loading'),
    challengeClosed: translate(locale, 'aiChallenge.challengeClosed'),
    alreadyGuessed: translate(locale, 'aiChallenge.alreadyGuessed'),
  }

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden pb-20 pt-32">
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-blue to-dark" />
        <div className="dot-pattern absolute inset-0 opacity-20" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 20% 30%, rgba(64,224,208,0.18), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,140,66,0.15), transparent 45%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1100px] px-6">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-turquoise/30 bg-turquoise/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-turquoise">
            <Sparkles className="h-3.5 w-3.5" />
            {translate(locale, 'aiChallenge.kicker')}
          </div>

          <h1 className="mb-5 font-teko text-5xl font-bold leading-none text-beige md:text-7xl lg:text-8xl">
            {translate(locale, 'aiChallenge.title')}
          </h1>

          <p className="mb-6 max-w-3xl text-xl leading-relaxed text-beige/80 md:text-2xl">
            {translate(locale, 'aiChallenge.subtitle')}
          </p>

          {event && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-beige/60 backdrop-blur-sm">
                <Trophy className="h-4 w-4 text-orange" />
                <span>{event.name}</span>
                <span className="text-beige/30">•</span>
                <span className="capitalize">{formatDate(event.date, locale, 'short')}</span>
              </div>
              {deadlineLabel && (
                <div
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm backdrop-blur-sm ${
                    isClosed
                      ? 'bg-red-500/10 text-red-300'
                      : 'bg-turquoise/10 text-turquoise'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span className="text-beige/40">
                    {translate(locale, 'aiChallenge.deadline')}:
                  </span>
                  <span className="capitalize">{deadlineLabel}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Description + Rules */}
      <section className="relative border-t border-white/5 py-20">
        <div className="dot-pattern absolute inset-0 opacity-10" />
        <div className="relative mx-auto grid max-w-[1100px] gap-12 px-6 md:grid-cols-5">
          <div className="md:col-span-3 space-y-5">
            <p className="text-lg leading-relaxed text-beige/70">
              {renderBold(translate(locale, 'aiChallenge.description'))}
            </p>
            <div className="flex gap-4 rounded-2xl border border-orange/20 bg-orange/5 p-5">
              <Gift className="h-6 w-6 flex-none text-orange" />
              <p className="text-sm leading-relaxed text-beige/80">
                {translate(locale, 'aiChallenge.prizeNotice')}
              </p>
            </div>
          </div>
          <div className="md:col-span-2">
            <h2 className="mb-4 font-teko text-3xl font-bold text-beige">
              {translate(locale, 'aiChallenge.rules')}
            </h2>
            <ul className="space-y-3 text-sm text-beige/70">
              {rules.map((rule, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-turquoise/15 text-xs font-bold text-turquoise">
                    {i + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Challenge form */}
      <section className="relative border-t border-white/5 py-20">
        <div className="relative mx-auto max-w-[900px] px-6">
          {event ? (
            <AiCounterChallengeClient
              eventId={`${event.year}-${event.slug}`}
              eventName={event.name}
              talks={talks}
              deadlineISO={deadlineISO || ''}
              isClosed={isClosed}
              t={clientT}
            />
          ) : (
            <div className="glass rounded-2xl border-white/10 p-8 text-center text-beige/70">
              {translate(locale, 'aiChallenge.noActiveEvent')}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function renderBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-beige">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}
