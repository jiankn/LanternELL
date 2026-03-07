'use client'

import { useState } from 'react'

interface BillingToggleProps {
  onChange: (isAnnual: boolean) => void
}

export function BillingToggle({ onChange }: BillingToggleProps) {
  const [isAnnual, setIsAnnual] = useState(false)

  const toggle = (annual: boolean) => {
    setIsAnnual(annual)
    onChange(annual)
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => toggle(false)}
        className={`text-sm font-medium transition-colors cursor-pointer ${
          !isAnnual ? 'text-text-primary' : 'text-text-muted'
        }`}
      >
        Monthly
      </button>

      <button
        role="switch"
        aria-checked={isAnnual}
        onClick={() => toggle(!isAnnual)}
        className={`relative w-14 h-7 rounded-full transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          isAnnual ? 'bg-primary' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            isAnnual ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </button>

      <button
        onClick={() => toggle(true)}
        className={`flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer ${
          isAnnual ? 'text-text-primary' : 'text-text-muted'
        }`}
      >
        Annual
        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
          Save 17%
        </span>
      </button>
    </div>
  )
}
