import { useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { ItemType } from "../types/types";

const useFetchMedia = () => {
    const { pathname } = useLocation()

    const fetchVideos = async (): Promise<ItemType[] | null> => {
        const res = await fetch(`/api/videos/`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dir: pathname,
                limit: 4,
                offset: 0
            })
        })

        return res.json() as Promise<ItemType[] | null>
    }
    return useQuery({
        queryKey: ['media', pathname],
        queryFn: fetchVideos
    })
}

export default useFetchMedia
