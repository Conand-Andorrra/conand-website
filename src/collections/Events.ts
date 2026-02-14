import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['featuredImage', 'name', 'year', 'date', 'status'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly slug (e.g. "devfest")',
      },
    },
    {
      name: 'year',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'upcoming',
      options: [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Past', value: 'past' },
      ],
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    // Action buttons
    {
      type: 'group',
      name: 'actionButtons',
      label: 'Action Buttons',
      fields: [
        {
          name: 'callForPapersEnabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'callForPapersUrl',
          type: 'text',
          admin: {
            condition: (data) => data?.actionButtons?.callForPapersEnabled,
          },
        },
        {
          name: 'ticketsEnabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'ticketsUrl',
          type: 'text',
          admin: {
            condition: (data) => data?.actionButtons?.ticketsEnabled,
          },
        },
      ],
    },
    // Speakers
    {
      name: 'speakers',
      type: 'relationship',
      relationTo: 'speakers',
      hasMany: true,
    },
    // Event sponsors
    {
      name: 'eventSponsors',
      type: 'array',
      label: 'Event Sponsors',
      fields: [
        {
          name: 'sponsor',
          type: 'relationship',
          relationTo: 'sponsors',
          required: true,
        },
        {
          name: 'tierOverride',
          type: 'select',
          admin: {
            description: 'Override the sponsor tier for this event only',
          },
          options: [
            { label: 'Platinum', value: 'platinum' },
            { label: 'Gold', value: 'gold' },
            { label: 'Silver', value: 'silver' },
            { label: 'Bronze', value: 'bronze' },
            { label: 'Collaborator', value: 'collaborator' },
          ],
        },
      ],
    },
    // Schedule
    {
      type: 'group',
      name: 'schedule',
      label: 'Schedule',
      fields: [
        {
          name: 'days',
          type: 'array',
          label: 'Days',
          fields: [
            {
              name: 'dayDate',
              type: 'date',
              required: true,
            },
          ],
        },
        {
          name: 'tracks',
          type: 'array',
          label: 'Tracks',
          fields: [
            {
              name: 'trackName',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'sessions',
          type: 'array',
          label: 'Sessions',
          fields: [
            {
              name: 'sessionTitle',
              type: 'text',
              localized: true,
            },
            {
              name: 'sessionDescription',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'sessionSpeaker',
              type: 'relationship',
              relationTo: 'speakers',
            },
            {
              name: 'dayIndex',
              type: 'number',
              required: true,
              defaultValue: 0,
              admin: {
                description: '0 = first day, 1 = second day, etc.',
              },
            },
            {
              name: 'trackIndex',
              type: 'number',
              required: true,
              defaultValue: 0,
              admin: {
                description: '0 = first track, 1 = second track, etc.',
              },
            },
            {
              name: 'startTime',
              type: 'text',
              required: true,
              admin: {
                description: 'Format: HH:MM',
              },
            },
            {
              name: 'endTime',
              type: 'text',
              required: true,
              admin: {
                description: 'Format: HH:MM',
              },
            },
          ],
        },
      ],
    },
  ],
}
