'use client'

import { useState, useCallback } from 'react'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

type ContactFormTranslations = {
  name: string
  email: string
  subject: string
  message: string
  send: string
  sending: string
  success: string
  error: string
  namePlaceholder: string
  emailPlaceholder: string
  subjectPlaceholder: string
  messagePlaceholder: string
}

type ContactFormProps = {
  t: ContactFormTranslations
}

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

function ContactFormInner({ t }: ContactFormProps) {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setStatus('sending')
      setErrorMessage('')

      try {
        let recaptchaToken = ''
        if (executeRecaptcha) {
          recaptchaToken = await executeRecaptcha('contact')
        }

        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, recaptchaToken }),
        })

        if (res.ok) {
          setStatus('success')
          setForm({ name: '', email: '', subject: '', message: '' })
        } else {
          const data = await res.json()
          setErrorMessage(data.error || t.error)
          setStatus('error')
        }
      } catch {
        setErrorMessage(t.error)
        setStatus('error')
      }
    },
    [form, executeRecaptcha, t.error],
  )

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-turquoise/20">
          <CheckCircle className="h-8 w-8 text-turquoise" />
        </div>
        <p className="text-lg font-semibold text-beige">{t.success}</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 text-sm text-beige/50 transition-colors hover:text-turquoise"
        >
          &larr;
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-beige/60">
            {t.name} *
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t.namePlaceholder}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-beige placeholder:text-beige/30 transition-colors focus:border-turquoise/50 focus:outline-none focus:ring-1 focus:ring-turquoise/25"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-beige/60">
            {t.email} *
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder={t.emailPlaceholder}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-beige placeholder:text-beige/30 transition-colors focus:border-turquoise/50 focus:outline-none focus:ring-1 focus:ring-turquoise/25"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-beige/60">
          {t.subject}
        </label>
        <input
          id="contact-subject"
          type="text"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder={t.subjectPlaceholder}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-beige placeholder:text-beige/30 transition-colors focus:border-turquoise/50 focus:outline-none focus:ring-1 focus:ring-turquoise/25"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-beige/60">
          {t.message} *
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder={t.messagePlaceholder}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-beige placeholder:text-beige/30 transition-colors focus:border-turquoise/50 focus:outline-none focus:ring-1 focus:ring-turquoise/25"
        />
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-turquoise px-8 py-3.5 font-semibold text-dark transition-all hover:shadow-lg hover:shadow-turquoise/25 disabled:opacity-60 disabled:cursor-not-allowed sm:w-auto"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.sending}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            {t.send}
          </>
        )}
      </button>
    </form>
  )
}

export function ContactForm(props: ContactFormProps) {
  if (recaptchaSiteKey) {
    return (
      <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
        <ContactFormInner {...props} />
      </GoogleReCaptchaProvider>
    )
  }

  // Render without reCAPTCHA provider when key is not set
  return <ContactFormInner {...props} />
}
