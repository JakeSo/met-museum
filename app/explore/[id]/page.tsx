import { fetchObject, NotFoundError } from "@/lib/data";
import { MuseumObject } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

export default async function DetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let artwork: MuseumObject;

  try {
    artwork = await fetchObject(Number(id));
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }

  const allImages = [
    artwork.primaryImage || artwork.primaryImageSmall,
    ...(artwork.additionalImages ?? []),
  ].filter(Boolean);

  const geography = [
    artwork.geographyType,
    artwork.city,
    artwork.state,
    artwork.county,
    artwork.country,
    artwork.region,
    artwork.subregion,
  ]
    .filter(Boolean)
    .join(", ");

  const artistLine = [artwork.artistDisplayBio, artwork.artistNationality]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="w-full space-y-10 pb-16">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/explore">
          <ArrowLeft className="size-4" />
          Back to Explore
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        {/* Images */}
        {allImages.length > 0 && (
          <div className="space-y-4">
            {allImages[0] && (
              <div className="relative w-full overflow-hidden rounded-xl bg-muted">
                <Image
                  src={allImages[0]}
                  alt={artwork.title}
                  width={1200}
                  height={1200}
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="mx-auto min-h-[50vh] max-h-[70vh] w-auto object-contain"
                  priority
                />
              </div>
            )}

            {allImages.length > 1 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {allImages.slice(1).map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-lg bg-muted"
                  >
                    <Image
                      src={src}
                      alt={`${artwork.title} — view ${i + 2}`}
                      fill
                      sizes="(max-width: 640px) 33vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Metadata */}
        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start max-w-200">
          <div className="space-y-1">
            {artwork.isHighlight && (
              <Badge variant="secondary" className="mb-2">
                Featured
              </Badge>
            )}
            <h1 className="text-2xl font-semibold leading-snug">
              {artwork.title}
            </h1>
            {artwork.artistDisplayName && (
              <p className="text-base text-muted-foreground">
                by {artwork.artistDisplayName}
              </p>
            )}
            {artistLine && (
              <p className="text-sm text-muted-foreground">{artistLine}</p>
            )}
          </div>

          <dl className="space-y-3">
            <Field label="Date" value={artwork.objectDate} />
            <Field label="Medium" value={artwork.medium} />
            <Field label="Dimensions" value={artwork.dimensions} />
            <Field label="Department" value={artwork.department} />
            <Field label="Classification" value={artwork.classification} />
            <Field label="Culture" value={artwork.culture} />
            <Field label="Period" value={artwork.period} />
            <Field label="Dynasty" value={artwork.dynasty} />
            <Field label="Geography" value={geography} />
            <Field
              label="Gallery"
              value={
                artwork.GalleryNumber ? `Gallery ${artwork.GalleryNumber}` : ""
              }
            />
            <Field label="Credit" value={artwork.creditLine} />
            <Field label="Accession" value={artwork.accessionNumber} />
            <Field
              label="Rights"
              value={
                artwork.isPublicDomain
                  ? "Public domain"
                  : artwork.rightsAndReproduction
              }
            />
          </dl>

          {(artwork.constituents ?? []).length > 0 && (
            <div className="space-y-4 rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Constituents
              </p>
              <div className="space-y-3">
                {artwork.constituents.map((constituent) => (
                  <div key={constituent.constituentID} className="space-y-1">
                    <p className="font-semibold">{constituent.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {constituent.role}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {constituent.constituentULAN_URL && (
                        <a
                          href={constituent.constituentULAN_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 text-muted-foreground hover:text-foreground"
                        >
                          ULAN
                        </a>
                      )}
                      {constituent.constituentWikidata_URL && (
                        <a
                          href={constituent.constituentWikidata_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 text-muted-foreground hover:text-foreground"
                        >
                          Wikidata
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(artwork.tags ?? []).length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {artwork.tags.map((tag) => (
                  <Badge key={tag.term} variant="outline">
                    {tag.term}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {artwork.objectURL && (
            <Button asChild variant="outline" className="w-full">
              <a
                href={artwork.objectURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on metmuseum.org
                <ExternalLink className="size-4" />
              </a>
            </Button>
          )}
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2">
      <dt className="text-xs text-muted-foreground pt-0.5">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}
