import { search, fetchObject } from '@/lib/data'
import { paramsToSearchOptions } from '@/lib/search-params'
import SearchBar from '@/components/SearchBar'
import FlatGallery from '@/components/FlatGallery'
import PaginationControls from '@/components/PaginationControls'
import { MuseumObject } from '@/lib/types'

const PAGE_SIZE = 20
const MAX_PAGES = 500

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const rawQ = params.q?.trim() ?? ''
  const hasFilters = !!(params.isHighlight || params.title || params.tags || params.isOnView ||
    params.artistOrCulture || params.hasImages || params.departmentId ||
    params.medium || params.geoLocation || params.dateBegin)
  const q = rawQ || (hasFilters ? '*' : '')
  const page = Math.max(1, parseInt(params.page ?? '1', 10))

  if (!q) {
    const highlights = await search('*', { isHighlight: true, hasImages: true })
    const highlightIDs = (highlights.objectIDs ?? []).slice(0, 40)
    const settled = await Promise.allSettled(highlightIDs.map(id => fetchObject(id)))
    const artworks = settled
      .filter((r): r is PromiseFulfilledResult<MuseumObject> => r.status === 'fulfilled' && !!r.value.primaryImageSmall)
      .map(r => r.value)

    return (
      <div className="w-full space-y-6">
        <SearchBar />
        <FlatGallery artworks={artworks} />
      </div>
    )
  }

  const options = paramsToSearchOptions(params)
  const result = await search(q, options)
  const objectIDs = result.objectIDs ?? []
  const cappedTotal = Math.min(objectIDs.length, MAX_PAGES * PAGE_SIZE)
  const totalPages = Math.ceil(cappedTotal / PAGE_SIZE)
  const slice = objectIDs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const settled = await Promise.allSettled(slice.map(id => fetchObject(id)))
  const artworks = settled
    .filter((r): r is PromiseFulfilledResult<MuseumObject> => r.status === 'fulfilled')
    .map(r => r.value)

  return (
    <div className="w-full space-y-6">
      <SearchBar />
      {artworks.length === 0 ? (
        <p className="py-24 text-center text-muted-foreground">
          No results found for &ldquo;{q}&rdquo;
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {result.total.toLocaleString()} results
          </p>
          <FlatGallery artworks={artworks} />
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  )
}
