// import { useLocation } from "react-router";
// import { useQuery, type UseQueryResult } from "@tanstack/react-query";
// import type { ItemType } from "../types/types";

// interface responseInterface {
//     data: ItemType[]
//     isMore: boolean
// }

// const useFetchMedia = (): UseQueryResult<responseInterface> => {
//     const { pathname } = useLocation()

//     const fetchVideos = async (): Promise<responseInterface> => {
//         const res = await fetch(`/api/videos/`, {
//             method: "POST",
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 dir: pathname,
//                 limit: 4,
//                 offset: 0
//             })
//         })

//         if (!res.ok) {
//       // If not OK, parse the error response and throw an Error
//       const errorData = await res.json();
//       throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
//     }

//     // Parse the JSON response.
//     const jsonResponse: responseInterface = await res.json();

//     if (jsonResponse === null || typeof jsonResponse !== 'object' || !('data' in jsonResponse) || !('isMore' in jsonResponse)) {
//         throw new Error("API response was null or did not match expected structure.");
//     }

//     return jsonResponse;

//     }
//     return useQuery<responseInterface>({
//         queryKey: ['media', pathname],
//         queryFn: fetchVideos
//     })
// }

// export default useFetchMedia

import { useLocation } from "react-router";
import { useInfiniteQuery, type UseInfiniteQueryResult } from "@tanstack/react-query";
import type { QueryKeyType, ResponseInterface, fetchInterface } from "../types/types";

const fetchVideos: fetchInterface = async ({ pageParam = 0, queryKey, signal }) => {
    const [_, pathname, limit] = queryKey
    const res = await fetch(`/api/videos/`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        signal,
        body: JSON.stringify({
            dir: pathname,
            limit,
            offset: pageParam
        })
    })

    if (!res.ok) {
        // If not OK, parse the error response and throw an Error
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    // Parse the JSON response.
    const jsonResponse: ResponseInterface = await res.json();

    if (jsonResponse === null || typeof jsonResponse !== 'object' || !('data' in jsonResponse) || !('isMore' in jsonResponse)) {
        throw new Error("API response was null or did not match expected structure.");
    }

    return jsonResponse;
}

const useFetchMedia = (): UseInfiniteQueryResult<ResponseInterface | Error> => {
    const { pathname } = useLocation()
    const limit = 5

    return useInfiniteQuery<ResponseInterface, Error, ResponseInterface, QueryKeyType, number>({
        queryKey: ['media', pathname, limit],
        initialPageParam: 0,
        queryFn: fetchVideos,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.isMore) return allPages.length * limit
            return  undefined
        }
    })
}

export default useFetchMedia
