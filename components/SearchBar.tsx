'use client'

import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { type SearchOptions } from '@/app/lib/data'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
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

export default function SearchBar({ loading }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery]               = useState('')
  const [scope, setScope]               = useState<Partial<Record<string, boolean>>>({})
  const [filterFlags, setFilterFlags]   = useState<Partial<Record<string, boolean>>>({})
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [medium, setMedium]             = useState('')
  const [geoLocation, setGeoLocation]   = useState('')
  const [departmentIds, setDepartmentIds] = useState<number[]>([])
  const [dateBegin, setDateBegin]       = useState('')
  const [dateEnd, setDateEnd]           = useState('')

  const toggle = (
    map: Partial<Record<string, boolean>>,
    set: (v: Partial<Record<string, boolean>>) => void,
    key: string,
  ) => set({ ...map, [key]: !map[key] })

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault()
    const params = buildSearchQuery(scope, filterFlags, medium, geoLocation, departmentIds, dateBegin, dateEnd, query)
    router.replace(`/explore?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
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
          <InputGroupButton type="submit" size="xs" disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Search in</span>
        {SCOPE_CHIPS.map(({ key, label }) => (
          <Chip
            key={key}
            active={!!scope[key]}
            onClick={() => toggle(scope, setScope, key)}
          >
            {label}
          </Chip>
        ))}

        <span className="text-xs text-muted-foreground ml-2">Filter</span>
        {FILTER_CHIPS.map(({ key, label }) => (
          <Chip
            key={key}
            active={!!filterFlags[key]}
            onClick={() => toggle(filterFlags, setFilterFlags, key)}
          >
            {label}
          </Chip>
        ))}

        <Chip
          active={showAdvanced}
          onClick={() => setShowAdvanced(v => !v)}
          className="ml-auto"
        >
          {showAdvanced ? 'Fewer filters' : 'More filters'}
        </Chip>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Medium" hint="comma-separated">
            <Input
              placeholder="e.g. Oil on canvas"
              value={medium}
              onChange={e => setMedium(e.target.value)}
              className="h-8 text-sm"
            />
          </Field>
          <Field label="Geographic location" hint="comma-separated">
            <Input
              placeholder="e.g. France, Paris"
              value={geoLocation}
              onChange={e => setGeoLocation(e.target.value)}
              className="h-8 text-sm"
            />
          </Field>
          <Field label="Department">
            <DepartmentCombobox selectedDeptIds={departmentIds} setSelectedDeptIds={setDepartmentIds} />
          </Field>
          <Field label="Date from">
            <Input
              type="number"
              placeholder="e.g. −500"
              value={dateBegin}
              onChange={e => setDateBegin(e.target.value)}
              className="h-8 text-sm"
            />
          </Field>
          <Field label="Date to">
            <Input
              type="number"
              placeholder="e.g. 1900"
              value={dateEnd}
              onChange={e => setDateEnd(e.target.value)}
              className="h-8 text-sm"
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
    if (dateBegin && dateEnd) {
        options.dateBegin = parseInt(dateBegin, 10)
        options.dateEnd = parseInt(dateEnd, 10)
    }
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (options.isHighlight) params.set('isHighlight', 'true')
    if (options.title) params.set('title', 'true')
    if (options.tags) params.set('tags', 'true')
    if (options.isOnView) params.set('isOnView', 'true')
    if (options.artistOrCulture) params.set('artistOrCulture', 'true')
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
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-2.5 py-0.5 text-xs transition-colors',
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground',
        className,
      )}
    >
      {children}
    </button>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        {hint && <span className="text-[10px] text-muted-foreground/60">{hint}</span>}
      </div>
      {children}
    </div>
  )
}
