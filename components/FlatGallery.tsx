import { MuseumObject } from '@/app/lib/types'
import FlatGalleryItem from './FlatGalleryItem'

export default function FlatGallery({ artworks }: { artworks: MuseumObject[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {artworks.map(a => (
        <FlatGalleryItem key={a.objectID} artwork={a} />
      ))}
    </div>
  )
}
