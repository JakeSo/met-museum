import { search, fetchObject } from "./lib/data";
import DomeGallery from "../components/DomeGallery";

async function getGalleryImages(): Promise<{ src: string; alt: string }[]> {
  const result = await search("*", { isHighlight: true, hasImages: true });
  const ids = (result.objectIDs ?? []).slice(0, 40);

  const objects = await Promise.allSettled(ids.map(id => fetchObject(id)));

  return objects
    .filter(
      (r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof fetchObject>>> =>
        r.status === "fulfilled" && !!r.value.primaryImageSmall
    )
    .map(r => ({
      src: r.value.primaryImageSmall,
      alt: r.value.title || r.value.objectName || "",
      title: r.value.title || "",
      artist: r.value.artistDisplayName || "",
      date: r.value.objectDate || "",
      medium: r.value.medium || "",
      department: r.value.department || "",
    }));
}

export default async function Home() {
  const images = await getGalleryImages();

  return (
    <div className="fixed inset-0">
      <DomeGallery
        images={images}
        overlayBlurColor="#0a0a0a"
        grayscale={false}
        openedImageWidth="400px"
        openedImageHeight="500px"
        // minRadius={750}
        fit={0.7}
      />
      <p className="fixed bottom-3 right-4 z-50 text-xs text-white/40 pointer-events-none select-none">
        Images via{" "}
        <a
          href="https://metmuseum.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 pointer-events-auto hover:text-white/70 transition-colors"
        >
          The Metropolitan Museum of Art Collection API
        </a>
        {" · "}
        <a
          href="https://www.reactbits.dev/components/dome-gallery"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 pointer-events-auto hover:text-white/70 transition-colors"
        >
          DomeGallery by React Bits
        </a>
      </p>
    </div>
  );
}
