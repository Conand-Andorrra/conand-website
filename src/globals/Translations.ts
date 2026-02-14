import type { GlobalConfig } from 'payload'

export const Translations: GlobalConfig = {
  slug: 'translations',
  label: 'Translations',
  access: {
    read: () => true,
  },
  fields: [
    // Navigation
    {
      type: 'group',
      name: 'nav',
      label: 'Navigation',
      fields: [
        { name: 'home', type: 'text', localized: true },
        { name: 'events', type: 'text', localized: true },
        { name: 'about', type: 'text', localized: true },
        { name: 'contact', type: 'text', localized: true },
        { name: 'faq', type: 'text', localized: true },
      ],
    },
    // Buttons
    {
      type: 'group',
      name: 'buttons',
      label: 'Buttons',
      fields: [
        { name: 'callForSpeakers', type: 'text', localized: true },
        { name: 'register', type: 'text', localized: true },
        { name: 'callForPapers', type: 'text', localized: true },
        { name: 'tickets', type: 'text', localized: true },
        { name: 'learnMore', type: 'text', localized: true },
      ],
    },
    // Home
    {
      type: 'group',
      name: 'home',
      label: 'Home',
      fields: [
        { name: 'saveTheDate', type: 'text', localized: true },
        { name: 'nextEvent', type: 'text', localized: true },
        { name: 'aboutTitle', type: 'text', localized: true },
        { name: 'contactTitle', type: 'text', localized: true },
        { name: 'contactText', type: 'text', localized: true },
        { name: 'sponsorsTitle', type: 'text', localized: true },
        { name: 'followUs', type: 'text', localized: true },
      ],
    },
    // Countdown
    {
      type: 'group',
      name: 'countdown',
      label: 'Countdown',
      fields: [
        { name: 'days', type: 'text', localized: true },
        { name: 'hours', type: 'text', localized: true },
        { name: 'minutes', type: 'text', localized: true },
        { name: 'seconds', type: 'text', localized: true },
        { name: 'untilNextEvent', type: 'text', localized: true },
      ],
    },
    // Events
    {
      type: 'group',
      name: 'event',
      label: 'Events',
      fields: [
        { name: 'upcomingEvent', type: 'text', localized: true },
        { name: 'pastEvent', type: 'text', localized: true },
        { name: 'speakers', type: 'text', localized: true },
        { name: 'schedule', type: 'text', localized: true },
        { name: 'tracks', type: 'text', localized: true },
        { name: 'day', type: 'text', localized: true },
        { name: 'noSpeakers', type: 'text', localized: true },
        { name: 'noSchedule', type: 'text', localized: true },
        { name: 'sponsorsTitle', type: 'text', localized: true },
      ],
    },
  ],
}
