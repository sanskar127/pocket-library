import { useGetMediaMutation } from '@/api/mediaApi'
import { RootState } from '@/store/store'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setData, resetData, setStatus } from "@/features/responseSlice"
import { getLimit } from '@/utils/utils'
import { Dimensions } from 'react-native'

const useFetchMedia = () => {
    const [getMedia] = useGetMediaMutation()
    const dispatch = useDispatch()

    const routeHistory = useSelector((state: RootState) => state.localRouter.history)
    const hasMore = useSelector((state: RootState) => state.response.hasMore)

    const pathname = useMemo(() => routeHistory.join('/'), [routeHistory])

    const [offset, setOffset] = useState<number>(0)
    const [deviceWidth, setDeviceWidth] = useState(Dimensions.get('window').width)

    const { initialLimit, limit } = useMemo(() => getLimit(deviceWidth), [deviceWidth])

    const isInitialLoad = useRef(true)

    const updateOffset = () => {
        if (hasMore) {
            setOffset(prev => prev + (prev === 0 ? initialLimit : limit))
        }
    }

    // Handle screen dimension changes
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

    // Reset data on pathname change
    useEffect(() => {
        isInitialLoad.current = true
        dispatch(resetData())
        setOffset(0)
    }, [pathname, dispatch])

    // Fetch media data
    useEffect(() => {
        const fetchData = async () => {
            dispatch(setStatus({ isLoading: true, isError: false }))
            try {
                const currentLimit = offset === 0 ? initialLimit : limit

                const response = await getMedia({
                    pathname,
                    offset,
                    limit: currentLimit,
                }).unwrap()

                if (response) {
                    dispatch(setData({ media: response.media, hasMore: response.hasMore }))
                }

                dispatch(setStatus({ isLoading: false, isError: false }))
                isInitialLoad.current = false

            } catch (e) {
                console.error('Failed to fetch media:', e)
                dispatch(setStatus({ isLoading: false, isError: true }))
            }
        }

        if (limit && initialLimit) {
            fetchData()
        }

    }, [pathname, offset, initialLimit, limit, getMedia, dispatch])

    const { isLoading, isError } = useSelector((state: RootState) => state.response.status)

    return {
        isLoading,
        isError,
        updateOffset,
        hasMore,
    }
}

export default useFetchMedia
