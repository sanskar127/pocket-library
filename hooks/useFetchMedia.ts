import { useGetMediaMutation } from '@/api/mediaApi'
import { RootState } from '@/store/store'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setData, resetData } from "@/features/responseSlice"
import { getLimit } from '@/utils/utils'
import { Dimensions } from 'react-native'

const useFetchMedia = () => {
    const [getMedia, { isLoading, isError }] = useGetMediaMutation()
    const dispatch = useDispatch()

    const routeHistory = useSelector((state: RootState) => state.localRouter.history)
    const data = useSelector((state: RootState) => state.response.data)
    const hasMore = useSelector((state: RootState) => state.response.hasMore)

    const pathname = useMemo(() => routeHistory.join('/'), [routeHistory])

    const [offset, setOffset] = useState<number>(0)
    const [deviceWidth, setDeviceWidth] = useState(Dimensions.get('window').width)

    // Stable screen width and limits
    const { initialLimit, limit } = useMemo(() => getLimit(deviceWidth), [deviceWidth])

    // Track if it's the initial load
    const isInitialLoad = useRef(true)

    // Updates the offset to fetch more data (pagination)
    const updateOffset = () => {
        if (hasMore) {
            setOffset(prev => prev + (prev === 0 ? initialLimit : limit))
        }
    }

    // Handle screen dimension changes with a small threshold to avoid noise
    useEffect(() => {
        const handleDimensionChange = ({ window }: { window: any }) => {
            const newWidth = window.width
            if (Math.abs(newWidth - deviceWidth) > 10) {
                setDeviceWidth(newWidth)
            }
        }

        const subscription = Dimensions.addEventListener('change', handleDimensionChange)
        return () => {
            subscription?.remove?.()
        }
    }, [deviceWidth])

    // Reset offset and data on pathname change
    useEffect(() => {
        isInitialLoad.current = true
        dispatch(resetData())
        setOffset(0)
    }, [pathname, dispatch])

    // Fetch media data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentLimit = offset === 0 ? initialLimit : limit

                const response = await getMedia({
                    pathname,
                    offset,
                    limit: currentLimit,
                }).unwrap()

                if (response) {
                    dispatch(setData(response))
                }

                // Mark initial load complete
                if (isInitialLoad.current) {
                    isInitialLoad.current = false
                }
            } catch (e) {
                console.error('Failed to fetch media:', e)
            }
        }

        // Only fetch if limits are valid
        if (limit && initialLimit) {
            fetchData()
        }
    }, [pathname, offset, limit, initialLimit, getMedia, dispatch])

    return {
        data,
        isLoading,
        isError,
        updateOffset,
        hasMore,
    }
}

export default useFetchMedia
