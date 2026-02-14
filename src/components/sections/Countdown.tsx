'use client'

import { useState, useEffect } from 'react'

type CountdownProps = {
  targetDate: string
  labels: {
    days: string
    hours: string
    minutes: string
    seconds: string
  }
}

function calcTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function Countdown({ targetDate, labels }: CountdownProps) {
  const target = new Date(targetDate)
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft(target))

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = calcTimeLeft(target)
      if (!tl) clearInterval(timer)
      setTimeLeft(tl)
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  if (!timeLeft) return null

  const boxes = [
    { value: timeLeft.days, label: labels.days },
    { value: timeLeft.hours, label: labels.hours },
    { value: timeLeft.minutes, label: labels.minutes },
    { value: timeLeft.seconds, label: labels.seconds },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {boxes.map((box) => (
        <div
          key={box.label}
          className="glass flex flex-col items-center rounded-2xl px-5 py-4 md:px-8 md:py-5"
        >
          <span className="font-teko text-4xl font-bold leading-none text-turquoise md:text-5xl">
            {String(box.value).padStart(2, '0')}
          </span>
          <span className="mt-1 text-xs font-medium uppercase tracking-wider text-beige/50">
            {box.label}
          </span>
        </div>
      ))}
    </div>
  )
}
