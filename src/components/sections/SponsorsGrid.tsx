import type { Sponsor, Media } from '@/payload-types'
import { getMediaUrl } from '@/lib/media'

type SponsorsGridProps = {
  sponsors: Sponsor[]
  tierLabels: Record<string, string>
}

const tierOrder = ['platinum', 'gold', 'silver', 'bronze', 'collaborator'] as const
const tierSizes: Record<string, string> = {
  platinum: 'max-w-[280px] md:max-w-[384px]',
  gold: 'max-w-[176px] md:max-w-[208px]',
  silver: 'max-w-[144px] md:max-w-[160px]',
  bronze: 'max-w-[112px] md:max-w-[128px]',
  collaborator: 'max-w-[96px] md:max-w-[112px]',
}

export function SponsorsGrid({ sponsors, tierLabels }: SponsorsGridProps) {
  const grouped: Record<string, Sponsor[]> = {}
  for (const tier of tierOrder) {
    const filtered = sponsors.filter((s) => s.tier === tier)
    if (filtered.length > 0) grouped[tier] = filtered
  }

  if (Object.keys(grouped).length === 0) return null

  return (
    <div className="space-y-10">
      {tierOrder.map((tier) => {
        const items = grouped[tier]
        if (!items) return null
        return (
          <div key={tier}>
            <p className="mb-5 text-center text-sm font-medium uppercase tracking-widest text-beige/40">
              {tierLabels[tier] || tier}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {items.map((sponsor) => {
                const logoUrl = getMediaUrl(sponsor.logo as Media)
                return (
                  <a
                    key={sponsor.id}
                    href={sponsor.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-50 transition-all duration-300 hover:opacity-100"
                  >
                    <img
                      src={logoUrl}
                      alt={sponsor.name}
                      className={`h-auto ${tierSizes[tier] || 'max-w-28'} brightness-0 invert`}
                    />
                  </a>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
