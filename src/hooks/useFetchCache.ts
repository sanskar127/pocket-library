import { useQueryClient } from "@tanstack/react-query";
import type { InfiniteResponseData, ItemType } from "../types/types";

const useFetchCache = (): ItemType[] => {
    const queryClient = useQueryClient();

    // Flatten cached query data and find the relevant video entry
    const cache = queryClient.getQueriesData<InfiniteResponseData>({ queryKey: ["media"] });

    for (const [, data] of cache) {
        if (data && 'pages' in data && Array.isArray(data.pages)) {
            return data.pages.flatMap(page => page.media);
        }
    }
    
    return []
}

export default useFetchCache
