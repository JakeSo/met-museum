import { fetchObject } from "@/app/lib/data";
import { MuseumObject } from "@/app/lib/types";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export default function DetailsPage() {
    const {query: id} = useRouter()
    const artworkRef = useRef<MuseumObject>(null)

    useEffect(() => {
        if (!id) return;

        fetchObject(Number(id)).then((artwork) => {
            artworkRef.current = artwork
        })
    }, [id])

}