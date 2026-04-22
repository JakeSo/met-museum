'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { type SearchOptions } from '@/lib/data'
import { searchOptionsToParams } from '@/lib/search-params'

export type BooleanFlags = Partial<Record<string, boolean>>

export function useSearchState() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [scope, setScope] = useState<'title' | 'tags' | 'artistOrCulture' | '' >('')
  const [filterFlags, setFilterFlags] = useState<BooleanFlags>({
    isHighlight: searchParams.get('isHighlight') === 'true',
    isOnView:    searchParams.get('isOnView') === 'true',
    hasImages:   searchParams.get('hasImages') === 'true',
  })
  const [medium, setMedium] = useState(searchParams.get('medium') ?? '')
  const [geoLocation, setGeoLocation] = useState(searchParams.get('geoLocation') ?? '')
  const [departmentId, setDepartmentId] = useState<number | null>(() => {
    const raw = searchParams.get('departmentId')
    const id = raw ? parseInt(raw, 10) : NaN
    return isNaN(id) ? null : id
  })
  const [dateBegin, setDateBegin] = useState(searchParams.get('dateBegin') ?? '')
  const [dateEnd, setDateEnd] = useState(searchParams.get('dateEnd') ?? '')
  const [showAdvanced, setShowAdvanced] = useState(
    !!(searchParams.get('medium') || searchParams.get('geoLocation') ||
       searchParams.get('departmentId') || searchParams.get('dateBegin'))
  )

  const toggleFlag = (state: BooleanFlags, setState: (v: BooleanFlags) => void, field: string) =>
    setState({ ...state, [field]: !state[field] })

  const hasActiveFilters = Boolean(
    query ||
    Object.values(filterFlags).some(Boolean) ||
   scope || medium || geoLocation || departmentId !== null || dateBegin || dateEnd
  )

  const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const options: SearchOptions = {
      title:           scope === 'title',
      tags:            scope === 'tags',
      artistOrCulture: scope === 'artistOrCulture',
      isHighlight:     filterFlags.isHighlight,
      isOnView:        filterFlags.isOnView,
      hasImages:       filterFlags.hasImages,
      medium:       medium.trim() ? medium.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      geoLocation:  geoLocation.trim() ? geoLocation.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      departmentId: departmentId ?? undefined,
      dateBegin:    dateBegin && dateEnd ? parseInt(dateBegin, 10) : undefined,
      dateEnd:      dateBegin && dateEnd ? parseInt(dateEnd, 10) : undefined,
    }
    startTransition(() => router.replace(`/explore?${searchOptionsToParams(options, query)}`))
  }

  const clear = () => {
    setQuery('')
    setScope('')
    setFilterFlags({})
    setMedium('')
    setGeoLocation('')
    setDepartmentId(null)
    setDateBegin('')
    setDateEnd('')
    setShowAdvanced(false)
    startTransition(() => router.replace('/explore'))
  }

  return {
    query, setQuery,
    scope, setScope,
    filterFlags, setFilterFlags,
    medium, setMedium,
    geoLocation, setGeoLocation,
    departmentId, setDepartmentId,
    dateBegin, setDateBegin,
    dateEnd, setDateEnd,
    showAdvanced, setShowAdvanced,
    toggleFlag,
    hasActiveFilters,
    isPending,
    submit,
    clear,
  }
}
