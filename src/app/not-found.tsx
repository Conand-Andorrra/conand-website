import Link from 'next/link'
import { t as translate } from '@/lib/i18n'
import { getLocale } from '@/lib/locale'

export default async function NotFound() {
  const locale = await getLocale()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-beige px-6 text-center">
      <h1 className="font-teko text-6xl font-bold text-dark-blue">404</h1>
      <p className="mt-4 text-xl text-dark-blue/70">
        {translate(locale, 'notFound.title')}
      </p>
      <Link
        href={locale === 'ca' ? '/' : `/${locale}`}
        className="mt-8 rounded-lg bg-turquoise px-6 py-3 font-semibold text-white transition-colors hover:bg-turquoise/80"
      >
        {translate(locale, 'notFound.back')}
      </Link>
    </div>
  )
}
