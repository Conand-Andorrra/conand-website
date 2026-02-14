import { Calendar } from 'lucide-react'

type SaveTheDateProps = {
  label: string
  dateFormatted: string
  eventName: string
}

export function SaveTheDate({ label, dateFormatted, eventName }: SaveTheDateProps) {
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-dark-blue/50">
      <div className="dot-pattern absolute inset-0 opacity-20" />
      <div className="relative mx-auto flex max-w-[1280px] flex-col items-center gap-4 px-6 py-8 md:flex-row md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange/10">
            <Calendar className="h-6 w-6 text-orange" />
          </div>
          <span className="font-teko text-2xl font-semibold text-beige md:text-3xl">
            {label}
          </span>
        </div>
        <div className="text-center md:text-right">
          <p className="text-lg font-medium capitalize text-beige/80">{dateFormatted}</p>
          <p className="text-sm text-beige/40">{eventName}</p>
        </div>
      </div>
    </section>
  )
}
