'use client'

import React, { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { type SearchOptions } from '@/app/lib/data'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { Label } from '@/components/ui/label'
import DepartmentCombobox from './DepartmentCombobox'

type SearchBarProps = {
  loading?: boolean
}

const SCOPE_CHIPS = [
  { key: 'title',         label: 'Title' },
  { key: 'tags',          label: 'Tags' },
  { key: 'artistOrCulture', label: 'Artist / Culture' },
] 

const FILTER_CHIPS = [
  { key: 'isHighlight', label: 'Highlights' },
  { key: 'isOnView',    label: 'On View' },
  { key: 'hasImages',   label: 'Has Images' },
]

export default function SearchBar({ loading: _loading }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery]             = useState(searchParams.get('q') ?? '')
  const [scope, setScope]             = useState<Partial<Record<string, boolean>>>({
    title:           searchParams.get('title') === 'true',
    tags:            searchParams.get('tags') === 'true',
    artistOrCulture: searchParams.get('artistOrCulture') === 'true',
  })
  const [filterFlags, setFilterFlags] = useState<Partial<Record<string, boolean>>>({
    isHighlight: searchParams.get('isHighlight') === 'true',
    isOnView:    searchParams.get('isOnView') === 'true',
    hasImages:   searchParams.get('hasImages') === 'true',
  })
  const [medium, setMedium]           = useState(searchParams.get('medium') ?? '')
  const [geoLocation, setGeoLocation] = useState(searchParams.get('geoLocation') ?? '')
  const [departmentIds, setDepartmentIds] = useState<number[]>(
    searchParams.get('departmentId')?.split(',').map(Number).filter(Boolean) ?? []
  )
  const [dateBegin, setDateBegin]     = useState(searchParams.get('dateBegin') ?? '')
  const [dateEnd, setDateEnd]         = useState(searchParams.get('dateEnd') ?? '')
  const [showAdvanced, setShowAdvanced] = useState(
    !!(searchParams.get('medium') || searchParams.get('geoLocation') ||
       searchParams.get('departmentId') || searchParams.get('dateBegin'))
  )

  const toggle = (
    map: Partial<Record<string, boolean>>,
    set: (v: Partial<Record<string, boolean>>) => void,
    key: string,
  ) => set({ ...map, [key]: !map[key] })

  const hasActiveFilters =
    Boolean(
      query ||
        Object.values(scope).some(Boolean) ||
        Object.values(filterFlags).some(Boolean) ||
        medium ||
        geoLocation ||
        departmentIds.length ||
        dateBegin ||
        dateEnd,
    )

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault()
    const params = buildSearchQuery(scope, filterFlags, medium, geoLocation, departmentIds, dateBegin, dateEnd, query)
    startTransition(() => {
      router.replace(`/explore?${params.toString()}`)
    })
  }

  const handleClear = () => {
    setQuery('')
    setScope({})
    setFilterFlags({})
    setMedium('')
    setGeoLocation('')
    setDepartmentIds([])
    setDateBegin('')
    setDateEnd('')
    setShowAdvanced(false)
    startTransition(() => {
      router.replace('/explore')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-300 mx-auto space-y-3 border-b-2 pb-6">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <Search className="size-4" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search the collection…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton type="submit" size="xs" disabled={isPending}>
            {isPending ? 'Searching…' : 'Search'}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <div className="flex flex-wrap items-center gap-1.5">
        <span id="search-scope-label" className="text-muted-foreground">Search in</span>
        <div role="group" aria-labelledby="search-scope-label" className="flex flex-wrap items-center gap-1.5">
          {SCOPE_CHIPS.map(({ key, label }) => (
            <Chip
              key={key}
              active={!!scope[key]}
              onClick={() => toggle(scope, setScope, key)}
            >
              {label}
            </Chip>
          ))}
        </div>

        <span id="search-filter-label" className="text-muted-foreground ml-2">Filter</span>
        <div role="group" aria-labelledby="search-filter-label" className="flex flex-wrap items-center gap-1.5">
          {FILTER_CHIPS.map(({ key, label }) => (
            <Chip
              key={key}
              active={!!filterFlags[key]}
              onClick={() => toggle(filterFlags, setFilterFlags, key)}
            >
              {label}
            </Chip>
          ))}
        </div>

        <Chip
          active={showAdvanced}
          onClick={() => setShowAdvanced(v => !v)}
        >
          {showAdvanced ? 'Fewer filters' : 'More filters'}
        </Chip>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={handleClear}
          >
            Clear filters
          </Button>
        )}
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Medium" hint="comma-separated" htmlFor="search-medium">
            <Input
              id="search-medium"
              placeholder="e.g. Oil on canvas"
              value={medium}
              onChange={e => setMedium(e.target.value)}
              className="h-8"
            />
          </Field>
          <Field label="Geographic location" hint="comma-separated" htmlFor="search-geo-location">
            <Input
              id="search-geo-location"
              placeholder="e.g. France, Paris"
              value={geoLocation}
              onChange={e => setGeoLocation(e.target.value)}
              className="h-8"
            />
          </Field>
          <Field label="Department" htmlFor="search-department">
            <DepartmentCombobox selectedDeptIds={departmentIds} setSelectedDeptIds={setDepartmentIds} inputId="search-department" />
          </Field>
          <Field label="Date from" htmlFor="search-date-begin">
            <Input
              id="search-date-begin"
              type="number"
              placeholder="e.g. −500"
              value={dateBegin}
              onChange={e => setDateBegin(e.target.value)}
              className="h-8"
            />
          </Field>
          <Field label="Date to" htmlFor="search-date-end">
            <Input
              id="search-date-end"
              type="number"
              placeholder="e.g. 1900"
              value={dateEnd}
              onChange={e => setDateEnd(e.target.value)}
              className="h-8"
            />
          </Field>
        </div>
      )}
    </form>
  )
}

function buildSearchQuery(scope: Partial<Record<string, boolean>>, filterFlags: Partial<Record<string, boolean>>, medium: string, geoLocation: string, departmentIds: number[], dateBegin: string, dateEnd: string, query: string) {
    const options: SearchOptions = {}
    if (scope.title) options.title = true
    if (scope.tags) options.tags = true
    if (scope.artistOrCulture) options.artistOrCulture = true
    if (filterFlags.isHighlight) options.isHighlight = true
    if (filterFlags.isOnView) options.isOnView = true
    if (filterFlags.hasImages) options.hasImages = true
    if (medium.trim())
        options.medium = medium.split(',').map(s => s.trim()).filter(Boolean)
    if (geoLocation.trim())
        options.geoLocation = geoLocation.split(',').map(s => s.trim()).filter(Boolean)
    if (departmentIds)
        options.departmentId = departmentIds 
    if (dateBegin !== '' && dateEnd !== '') {
        options.dateBegin = parseInt(dateBegin, 10)
        options.dateEnd = parseInt(dateEnd, 10)
    }
    const params = new URLSearchParams()
    if (options.title) params.set('title', 'true')
    if (options.tags) params.set('tags', 'true')
    if (options.artistOrCulture) params.set('artistOrCulture', 'true')
    if (query) params.set('q', query)
    if (options.isHighlight) params.set('isHighlight', 'true')
    if (options.isOnView) params.set('isOnView', 'true')
    if (options.hasImages) params.set('hasImages', 'true')
    if (options.departmentId?.length)
        params.set('departmentId', options.departmentId.join(','))
    if (options.medium?.length)
        params.set('medium', options.medium.join(','))
    if (options.geoLocation?.length)
        params.set('geoLocation', options.geoLocation.join(','))
    if (options.dateBegin !== undefined && options.dateEnd !== undefined) {
        params.set('dateBegin', String(options.dateBegin))
        params.set('dateEnd', String(options.dateEnd))
    }
    return params
}

function Chip({
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

function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string
  hint?: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-1">
        <Label htmlFor={htmlFor} className="text-muted-foreground">
          {label}
        </Label>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  )
}
