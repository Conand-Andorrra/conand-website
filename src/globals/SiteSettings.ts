import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    // General
    {
      type: 'group',
      name: 'general',
      label: 'General',
      fields: [
        {
          name: 'siteName',
          type: 'text',
          defaultValue: 'CONAND',
        },
        {
          name: 'siteDescription',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'contactEmail',
          type: 'text',
          defaultValue: 'contact@con.ad',
        },
        {
          name: 'googleAnalyticsId',
          type: 'text',
        },
      ],
    },
    // Hero
    {
      type: 'group',
      name: 'hero',
      label: 'Hero',
      fields: [
        {
          name: 'heroImages',
          type: 'array',
          label: 'Hero Slider Images',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
        {
          name: 'heroPrimaryButtonText',
          type: 'text',
          localized: true,
        },
        {
          name: 'heroPrimaryButtonUrl',
          type: 'text',
        },
        {
          name: 'heroSecondaryButtonText',
          type: 'text',
          localized: true,
        },
        {
          name: 'heroSecondaryButtonUrl',
          type: 'text',
        },
      ],
    },
    // About
    {
      type: 'group',
      name: 'about',
      label: 'About',
      fields: [
        {
          name: 'aboutText',
          type: 'richText',
          localized: true,
        },
        {
          name: 'aboutImage1',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'aboutImage2',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    // Social
    {
      type: 'group',
      name: 'social',
      label: 'Social Links',
      fields: [
        {
          name: 'linkedinUrl',
          type: 'text',
        },
        {
          name: 'twitterUrl',
          type: 'text',
        },
        {
          name: 'youtubeUrl',
          type: 'text',
        },
        {
          name: 'twitchUrl',
          type: 'text',
        },
      ],
    },
    // Sponsor tier names
    {
      type: 'group',
      name: 'sponsorTiers',
      label: 'Sponsor Tier Names',
      fields: [
        {
          name: 'tiers',
          type: 'array',
          fields: [
            {
              name: 'tierId',
              type: 'select',
              required: true,
              options: [
                { label: 'Platinum', value: 'platinum' },
                { label: 'Gold', value: 'gold' },
                { label: 'Silver', value: 'silver' },
                { label: 'Bronze', value: 'bronze' },
                { label: 'Collaborator', value: 'collaborator' },
              ],
            },
            {
              name: 'tierLabel',
              type: 'text',
              localized: true,
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
