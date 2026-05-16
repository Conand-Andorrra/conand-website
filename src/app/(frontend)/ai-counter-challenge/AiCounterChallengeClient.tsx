'use client'

import { useCallback, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { getFirebaseAuth, GoogleAuthProvider } from '@/lib/firebase'
import { getMyGuess, insertMyGuess } from '@/lib/ai-counter-store'
import { LogOut, Check, AlertCircle, Loader2, Clock, Lock } from 'lucide-react'

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

type Talk = {
  id: string
  title: string
  startTime: string
  endTime: string
  speakerName: string | null
}

type ClientT = {
  signInTitle: string
  signInDescription: string
  signInGoogle: string
  signOut: string
  signedInAs: string
  totalGuess: string
  totalGuessHelp: string
  perTalkGuess: string
  perTalkHelp: string
  submit: string
  update: string
  saving: string
  saved: string
  errorSaving: string
  errorSignIn: string
  yourGuess: string
  loading: string
  challengeClosed: string
  alreadyGuessed: string
}

type Props = {
  eventId: string
  eventName: string
  talks: Talk[]
  deadlineISO: string
  isClosed: boolean
  t: ClientT
}

type Status = 'idle' | 'saving' | 'saved' | 'error-save' | 'error-signin'

export function AiCounterChallengeClient({
  eventId,
  talks,
  deadlineISO,
  isClosed: isClosedServer,
  t,
}: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [totalGuess, setTotalGuess] = useState<string>('')
  const [perTalk, setPerTalk] = useState<Record<string, string>>({})
  const [hasExistingGuess, setHasExistingGuess] = useState(false)
  const [status, setStatus] = useState<Status>('idle')

  // Re-check deadline client-side too — server is rendered statically so its
  // "now" may be stale; the browser's clock is the source of truth here.
  const isClosed = isClosedServer || (deadlineISO ? new Date() > new Date(deadlineISO) : false)

  useEffect(() => {
    const auth = getFirebaseAuth()
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthReady(true)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!user) {
      setTotalGuess('')
      setPerTalk({})
      setHasExistingGuess(false)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const existing = await getMyGuess(eventId)
        if (cancelled || !existing) return
        setTotalGuess(String(existing.totalGuess))
        const perTalkStr: Record<string, string> = {}
        for (const [k, v] of Object.entries(existing.perTalkGuesses || {})) {
          perTalkStr[k] = String(v)
        }
        setPerTalk(perTalkStr)
        setHasExistingGuess(true)
      } catch (err) {
        // First-time users won't have a row yet; ignore "not found" style errors.
        console.warn('No existing guess (or load failed):', err)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user, eventId])

  const handleSignIn = useCallback(async () => {
    try {
      const auth = getFirebaseAuth()
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      setStatus('idle')
    } catch (err) {
      console.error('Sign-in error', err)
      setStatus('error-signin')
    }
  }, [])

  const handleSignOut = useCallback(async () => {
    await signOut(getFirebaseAuth())
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!user) return
      if (hasExistingGuess) return
      if (deadlineISO && new Date() > new Date(deadlineISO)) return
      const total = parseInt(totalGuess, 10)
      if (Number.isNaN(total) || total < 0) return

      setStatus('saving')
      try {
        const perTalkGuesses: Record<string, number> = {}
        for (const [k, v] of Object.entries(perTalk)) {
          const n = parseInt(v, 10)
          if (!Number.isNaN(n) && n >= 0) perTalkGuesses[k] = n
        }
        await insertMyGuess({
          eventId,
          userName: user.displayName || user.email || 'Anonymous',
          userEmail: user.email || '',
          userPhotoURL: user.photoURL,
          totalGuess: total,
          perTalkGuesses,
        })
        setHasExistingGuess(true)
        setStatus('saved')
      } catch (err) {
        console.error('Save error', err)
        setStatus('error-save')
      }
    },
    [user, totalGuess, perTalk, eventId, deadlineISO, hasExistingGuess],
  )

  if (isClosed) {
    return (
      <div className="glass rounded-2xl border-orange/20 bg-orange/5 p-8 text-center md:p-12">
        <Clock className="mx-auto mb-4 h-10 w-10 text-orange" />
        <p className="text-lg leading-relaxed text-beige/80">{t.challengeClosed}</p>
      </div>
    )
  }

  if (!authReady) {
    return (
      <div className="glass flex items-center justify-center gap-2 rounded-2xl border-white/10 p-12 text-beige/60">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>{t.loading}</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="glass rounded-2xl border-white/10 p-8 md:p-12">
        <h2 className="mb-3 font-teko text-3xl font-bold text-beige md:text-4xl">
          {t.signInTitle}
        </h2>
        <p className="mb-8 text-beige/70">{t.signInDescription}</p>
        <button
          type="button"
          onClick={handleSignIn}
          className="inline-flex items-center gap-3 rounded-xl border border-[#dadce0] bg-white px-6 py-3 text-[15px] font-medium text-[#3c4043] shadow-sm transition-all hover:bg-[#f8f9fa] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4285F4]"
        >
          <GoogleLogo className="h-[18px] w-[18px]" />
          {t.signInGoogle}
        </button>
        {status === 'error-signin' && (
          <p className="mt-4 flex items-center gap-2 text-sm text-red-400">
            <AlertCircle className="h-4 w-4" />
            {t.errorSignIn}
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl border-white/10 p-6 md:p-10">
      {/* User badge */}
      <div className="mb-8 flex items-center justify-between gap-4 rounded-xl bg-white/[0.03] p-3">
        <div className="flex items-center gap-3 min-w-0">
          {user.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoURL}
              alt={user.displayName || ''}
              className="h-10 w-10 flex-none rounded-full border border-white/10"
            />
          ) : (
            <div className="h-10 w-10 flex-none rounded-full bg-turquoise/20" />
          )}
          <div className="min-w-0">
            <p className="text-xs text-beige/40">{t.signedInAs}</p>
            <p className="truncate text-sm font-medium text-beige">
              {user.displayName || user.email}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex flex-none items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-beige/60 transition-all hover:bg-white/5 hover:text-beige"
        >
          <LogOut className="h-3 w-3" />
          {t.signOut}
        </button>
      </div>

      {/* Locked notice — shown above the (disabled) form once a guess exists */}
      {hasExistingGuess && (
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-turquoise/30 bg-turquoise/5 p-4">
          <Lock className="mt-0.5 h-5 w-5 flex-none text-turquoise" />
          <p className="text-sm leading-relaxed text-beige/85">{t.alreadyGuessed}</p>
        </div>
      )}

      {/* Total */}
      <label className="mb-8 block">
        <span className="mb-1 block font-teko text-2xl font-bold text-beige">
          {hasExistingGuess ? t.yourGuess : t.totalGuess}
        </span>
        <span className="mb-3 block text-sm text-beige/50">{t.totalGuessHelp}</span>
        <input
          type="number"
          min="0"
          required
          disabled={hasExistingGuess}
          value={totalGuess}
          onChange={(e) => setTotalGuess(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-dark/60 px-5 py-4 text-2xl font-bold text-beige outline-none transition-all placeholder:text-beige/20 focus:border-turquoise/50 focus:bg-dark/80 disabled:cursor-not-allowed disabled:opacity-70"
          placeholder="0"
        />
      </label>

      {/* Per-talk */}
      {talks.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-1 font-teko text-2xl font-bold text-beige">{t.perTalkGuess}</h3>
          <p className="mb-4 text-sm text-beige/50">{t.perTalkHelp}</p>
          <div className="space-y-2">
            {talks.map((talk) => (
              <div
                key={talk.id}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-beige">{talk.title}</p>
                  <p className="truncate text-xs text-beige/40">
                    {talk.speakerName ? `${talk.speakerName} • ` : ''}
                    {talk.startTime}
                    {talk.endTime ? `–${talk.endTime}` : ''}
                  </p>
                </div>
                <input
                  type="number"
                  min="0"
                  disabled={hasExistingGuess}
                  value={perTalk[talk.id] || ''}
                  onChange={(e) =>
                    setPerTalk((prev) => ({ ...prev, [talk.id]: e.target.value }))
                  }
                  className="w-24 flex-none rounded-lg border border-white/10 bg-dark/60 px-3 py-2 text-center text-base font-semibold text-beige outline-none transition-all placeholder:text-beige/20 focus:border-turquoise/50 disabled:cursor-not-allowed disabled:opacity-70"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit (hidden once the guess is locked) */}
      {!hasExistingGuess && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <button
            type="submit"
            disabled={status === 'saving' || !totalGuess}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-turquoise px-7 py-3.5 font-semibold text-dark transition-all hover:shadow-lg hover:shadow-turquoise/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'saving' && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === 'saving' ? t.saving : t.submit}
          </button>

          {status === 'saved' && (
            <p className="flex items-center gap-2 text-sm text-turquoise">
              <Check className="h-4 w-4" />
              {t.saved}
            </p>
          )}
          {status === 'error-save' && (
            <p className="flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" />
              {t.errorSaving}
            </p>
          )}
        </div>
      )}
    </form>
  )
}
