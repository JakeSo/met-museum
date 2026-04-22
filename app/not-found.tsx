import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen">
      <div className="sticky bg-white top-0 z-10 flex items-center justify-between px-12 py-6 pointer-events-none">
        <h1 className="text-2xl font-bold tracking-tight">Met Collection</h1>
        <Button asChild className="pointer-events-auto" size="lg">
          <Link href="/explore">
            Explore <Search className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="text-6xl font-bold text-muted-foreground mb-4">
              404
            </CardTitle>
            <CardTitle className="text-xl">Page Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The artwork or page you&apos;re looking for doesn&apos;t exist in
              our collection.
            </p>
            <div className="flex gap-2 justify-center">
              <Button asChild variant="outline">
                <Link href="/">
                  <Home className="size-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Button asChild>
                <Link href="/explore">
                  <Search className="size-4 mr-2" />
                  Explore Collection
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
