import { search, fetchObject } from "../lib/data";
import Masonry, { type MasonryItem } from "../components/Masonry";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HEIGHTS = [720, 960, 600, 840, 680, 1000, 560, 800];

async function getMasonryItems(): Promise<MasonryItem[]> {
  const result = await search("*", { isHighlight: true, hasImages: true });
  const ids = (result.objectIDs ?? []).slice(0, 40);
  const objects = await Promise.allSettled(ids.map((id) => fetchObject(id)));

  return objects
    .filter(
      (
        r,
      ): r is PromiseFulfilledResult<Awaited<ReturnType<typeof fetchObject>>> =>
        r.status === "fulfilled" && !!r.value.primaryImageSmall,
    )
    .map((r, i) => ({
      id: String(r.value.objectID),
      img: r.value.primaryImageSmall,
      title: r.value.title,
      url: `/explore/${r.value.objectID}`,
      height: HEIGHTS[i % HEIGHTS.length],
    }));
}

export default async function Home() {
  const items = await getMasonryItems();

  return (
    <main id="main-content" className="min-h-screen">
      <div className="sticky bg-background top-0 z-10 flex items-center justify-between px-12 py-6 pointer-events-none">
        <h1 className="text-2xl font-bold tracking-tight">Met Collection</h1>
        <Button asChild className="pointer-events-auto" size="lg">
          <Link href="/explore">
            Explore <ArrowRight className="size-4" />
          </Link>
        </Button> 
      </div>

      <div className="px-6 pb-12 min-h-[100vh]">
        <Masonry
          items={items}
          animateFrom="bottom"
          blurToFocus
          scaleOnHover
          hoverScale={0.97}
          stagger={0.03}
        />
      </div>

      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-3xl font-medium text-center">470,000+ works in the collection</p>
        <Button asChild size="lg">
          <Link href="/explore">
            Search the full collection <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <p className="py-6 text-center text-xs text-muted-foreground">
        Images via{" "}
        <a
          href="https://metmuseum.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          The Metropolitan Museum of Art Collection API
        </a>
      </p>
    </main>
  );
}
