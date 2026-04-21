import { unstable_cache } from 'next/cache'
import { CollectionResult, Department, MuseumObject } from "./types";

const MET_API = 'https://collectionapi.metmuseum.org/public/collection/v1'

export type SearchOptions = {
  isHighlight?: boolean
  title?: boolean
  tags?: boolean
  departmentId?: number[]
  isOnView?: boolean
  artistOrCulture?: boolean
  medium?: string[]
  hasImages?: boolean
  geoLocation?: string[]
  dateBegin?: number
  dateEnd?: number
}

export const search = async (
  q: string,
  options?: SearchOptions,
): Promise<CollectionResult> => {
  const url = new URL(`${MET_API}/search`)
  url.searchParams.set('q', q)

  if (options) {
    const { isHighlight, title, tags, departmentId, isOnView, artistOrCulture, medium, hasImages, geoLocation, dateBegin, dateEnd } = options
    if (isHighlight !== undefined) url.searchParams.set('isHighlight', String(isHighlight))
    if (title !== undefined) url.searchParams.set('title', String(title))
    if (tags !== undefined) url.searchParams.set('tags', String(tags))
    if (departmentId?.length) url.searchParams.set('departmentIds', departmentId.join('|'))
    if (isOnView !== undefined) url.searchParams.set('isOnView', String(isOnView))
    if (artistOrCulture !== undefined) url.searchParams.set('artistOrCulture', String(artistOrCulture))
    if (medium?.length) url.searchParams.set('medium', String(medium.join('|')))
    if (hasImages !== undefined) url.searchParams.set('hasImages', String(hasImages))
    if (geoLocation?.length) url.searchParams.set('geoLocation', geoLocation.join('|'))
    if (dateBegin !== undefined && dateEnd !== undefined) {
      url.searchParams.set('dateBegin', String(dateBegin))
      url.searchParams.set('dateEnd', String(dateEnd))
    }
  }

  const response = await fetch(url.toString(), { next: { revalidate: 300 } })
  if (!response.ok) throw new Error(`Search failed: ${response.statusText}`)
  return response.json()
}

export const fetchObject = unstable_cache(
  async (objectId: number): Promise<MuseumObject> => {
    const response = await fetch(`${MET_API}/objects/${objectId}`)
    if (!response.ok) throw new Error(`Failed to fetch object ${objectId}: ${response.statusText}`)
    return response.json()
  },
  ['fetchObject'],
  { revalidate: 86400 },
)

export const fetchDepartments = async (): Promise<Department[]> => {
  const response = await fetch(`${MET_API}/departments`, { next: { revalidate: 86400 } })
  if (!response.ok) throw new Error(`Failed to fetch departments: ${response.statusText}`)
  const json: { departments: Department[] } = await response.json()
  return json.departments
}
