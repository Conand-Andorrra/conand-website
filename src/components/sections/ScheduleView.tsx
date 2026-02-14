'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { formatDate } from '@/lib/i18n'
import type { Speaker } from '@/payload-types'

type Session = {
  sessionTitle: string
  sessionDescription?: string | null
  sessionSpeaker?: Speaker | string | number | null
  dayIndex: number
  trackIndex: number
  startTime: string
  endTime: string
  id?: string | null
}

type ScheduleViewProps = {
  days: { dayDate: string; id?: string | null }[]
  tracks: { trackName: string; id?: string | null }[]
  sessions: Session[]
  dayLabel: string
  locale: string
}

export function ScheduleView({ days, tracks, sessions, dayLabel, locale }: ScheduleViewProps) {
  if (sessions.length === 0) return null

  const content = (dayIndex: number) => (
    <div className="space-y-10">
      {tracks.map((track, trackIdx) => {
        const trackSessions = sessions
          .filter((s) => s.dayIndex === dayIndex && s.trackIndex === trackIdx)
          .sort((a, b) => a.startTime.localeCompare(b.startTime))

        if (trackSessions.length === 0) return null

        return (
          <div key={trackIdx}>
            {tracks.length > 1 && (
              <h4 className="mb-5 font-teko text-xl font-semibold text-turquoise">
                {track.trackName}
              </h4>
            )}
            <div className="space-y-3">
              {trackSessions.map((session, i) => {
                const speakerName =
                  session.sessionSpeaker &&
                  typeof session.sessionSpeaker === 'object' &&
                  'name' in session.sessionSpeaker
                    ? session.sessionSpeaker.name
                    : null

                return (
                  <div
                    key={session.id || i}
                    className="glass group rounded-xl p-4 transition-all hover:border-white/15"
                  >
                    <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-4">
                      <span className="shrink-0 font-teko text-lg font-medium text-orange">
                        {session.startTime} - {session.endTime}
                      </span>
                      <div>
                        <p className="font-semibold text-beige">{session.sessionTitle}</p>
                        {speakerName && (
                          <p className="text-sm text-turquoise">{speakerName}</p>
                        )}
                        {session.sessionDescription && (
                          <p className="mt-1 text-sm text-beige/40">
                            {session.sessionDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )

  if (days.length <= 1) {
    return content(0)
  }

  return (
    <Tabs defaultValue="0">
      <TabsList className="mb-6 border border-white/10 bg-dark-blue/50">
        {days.map((day, i) => (
          <TabsTrigger
            key={i}
            value={String(i)}
            className="text-beige/50 data-[state=active]:bg-turquoise/20 data-[state=active]:text-turquoise"
          >
            {dayLabel} {i + 1} - {formatDate(day.dayDate, locale, 'short')}
          </TabsTrigger>
        ))}
      </TabsList>
      {days.map((_, i) => (
        <TabsContent key={i} value={String(i)}>
          {content(i)}
        </TabsContent>
      ))}
    </Tabs>
  )
}
