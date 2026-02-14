import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Speakers } from './collections/Speakers'
import { Sponsors } from './collections/Sponsors'
import { Events } from './collections/Events'
import { SiteSettings } from './globals/SiteSettings'
import { Translations } from './globals/Translations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' - CONAND Admin',
    },
  },
  collections: [Users, Media, Speakers, Sponsors, Events],
  globals: [SiteSettings, Translations],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'default-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./data/db.sqlite',
    },
  }),
  localization: {
    locales: [
      { label: 'Catala', code: 'ca' },
      { label: 'Espanyol', code: 'es' },
      { label: 'English', code: 'en' },
      { label: 'Francais', code: 'fr' },
    ],
    defaultLocale: 'ca',
    fallback: true,
  },
  sharp,
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
})
