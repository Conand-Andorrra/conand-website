import type { Metadata } from 'next'
import { Teko, Karla } from 'next/font/google'
import { getLocale } from '@/lib/locale'
import './globals.css'

const teko = Teko({
  subsets: ['latin'],
  variable: '--font-teko',
  display: 'swap',
})

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CONAND - Tech Conference',
  description:
    'Join CONAND for an immersive experience filled with insightful talks, hands-on workshops, and networking opportunities.',
  icons: {
    icon: '/img/conand_logo.png',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()

  return (
    <html lang={locale}>
      <body
        className={`${teko.variable} ${karla.variable} font-karla bg-dark text-beige antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
