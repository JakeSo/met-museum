'use client'

import React from 'react'
import { Toggle } from '@/components/ui/toggle'

export function SearchChip({
  active,
  onClick,
  className,
  children,
}: {
  active: boolean
  onClick: () => void
  className?: string
  children: React.ReactNode
}) {
  return (
    <Toggle
      type="button"
      pressed={active}
      onPressedChange={onClick}
      size="sm"
      variant="outline"
      className={`rounded-full ${className ?? ''}`}
    >
      {children}
    </Toggle>
  )
}
