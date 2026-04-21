import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="w-full space-y-10 pb-16">
      <Skeleton className="h-8 w-36" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        {/* Image column */}
        <div className="space-y-4">
          <Skeleton className="aspect-4/3 w-full rounded-xl" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>

        {/* Metadata column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[120px_1fr] gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4" style={{ width: `${60 + (i % 3) * 15}%` }} />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-10" />
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          </div>

          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    </div>
  )
}
