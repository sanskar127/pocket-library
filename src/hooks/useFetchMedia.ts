import { useInfiniteQuery } from "@tanstack/react-query";
import usePathTracker from "./usePathTracker"
import type { QueryKeyType, ResponseInterface, UseFetchMediaInterface } from "../types/types";
import { getLimit } from "../utils";

const useFetchMedia: UseFetchMediaInterface = () => {
    const pathname = usePathTracker()
    const { initialLimit, limit } = getLimit()

    const fetchVideos = async ({ pageParam: offset }: { pageParam: number }): Promise<ResponseInterface> => {
        const res = await fetch(`/api/videos/`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pathname,
                limit: offset === 0 ? initialLimit : limit,
                offset
            })
        })

        if (!res.ok) {
            // If not OK, parse the error response and throw an Error
            const errorData = await res.json();
            throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }

        // Parse the JSON response.
        const jsonResponse: ResponseInterface = await res.json();


        if (jsonResponse === null || typeof jsonResponse !== 'object' || !('media' in jsonResponse) || !('hasMore' in jsonResponse)) {
            throw new Error("API response was null or did not match expected structure.");
        }

        return jsonResponse;
    }

    return useInfiniteQuery<ResponseInterface, Error, ResponseInterface, QueryKeyType, number>({
        queryKey: ['media', pathname],
        initialPageParam: 0,
        queryFn: fetchVideos,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.hasMore) return allPages.length * limit
            return undefined
        }
    })
}

export default useFetchMedia
