import { MuseumObject } from "@/app/lib/types";
import { Card, CardAction, CardTitle, CardDescription, CardHeader } from "./ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import Link from "next/link";

export default function FlatGalleryItem({ artwork }: { artwork: MuseumObject }) {
    const primary = artwork.primaryImageSmall || artwork.primaryImage

    const meta = [artwork.medium, artwork.objectDate, artwork.culture]
        .filter(Boolean)
        .join(' | ')

    return (
        <Link href={`/explore/${artwork.objectID}`} className="block hover:scale-[1.02] transition-transform">
            <Card className="gap-0 py-0">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-t-xl">
                    {primary ? <Image src={primary} alt={artwork.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" className="object-cover" /> : <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">No Image</div>}
                </div>

                <CardHeader className="py-4">
                    {artwork.isHighlight && (
                        <CardAction>
                            <Badge variant="secondary">Featured</Badge>
                        </CardAction>
                    )}
                    <CardTitle className="line-clamp-2">
                        <strong>{artwork.title}</strong>
                        {artwork.artistDisplayName && <span className="font-normal"> by {artwork.artistDisplayName}</span>}
                    </CardTitle>
                    {meta && <CardDescription className="line-clamp-2">{meta}</CardDescription>}
                </CardHeader>
            </Card>
        </Link>
    )
}
