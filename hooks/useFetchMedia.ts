import { useGetMediaMutation } from '@/api/mediaApi'
import { RootState } from '@/store/store'
import { useEffect, useMemo, useState } from 'react'
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

    // Memoized limits based on screen width
    const { initialLimit, limit } = useMemo(() => getLimit(deviceWidth), [deviceWidth])

    // Updates the offset to fetch more data
    const updateOffset = () => {
        if (hasMore) {
            setOffset(prev => prev + (prev === 0 ? initialLimit : limit))
        }
    }

    // Handle screen dimension changes
    useEffect(() => {
        const handleDimensionChange = ({ window }: { window: any }) => {
            setDeviceWidth(window.width)
        }

        const subscription = Dimensions.addEventListener('change', handleDimensionChange)

        return () => {
            subscription?.remove?.()
        }
    }, [])

    // Fetch media data when pathname, offset, or limits change
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getMedia({
                    pathname,
                    offset,
                    limit: offset === 0 ? initialLimit : limit,
                }).unwrap()

                if (offset === 0) {
                    dispatch(resetData())
                }

                if (response) {
                    dispatch(setData(response))
                }
            } catch (e) {
                console.error('Failed to fetch media:', e)
            }
        }

        fetchData()
    }, [pathname, offset, initialLimit, limit, dispatch, getMedia])

    return {
        data,
        isLoading,
        isError,
        updateOffset,
        hasMore,
    }
}

export default useFetchMedia
