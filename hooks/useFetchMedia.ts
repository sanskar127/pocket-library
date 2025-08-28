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
    const pathname = useMemo(() => routeHistory.join('/'), [routeHistory])
    const [offset, setOffset] = useState<number>(0)
    const [deviceWidth, setDeviceWidth] = useState(Dimensions.get('window').width)
    const { initialLimit, limit } = getLimit(deviceWidth)

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

    // Fetch media data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getMedia({
                    pathname,
                    offset,
                    limit: offset === 0 ? initialLimit : limit,
                }).unwrap()

                if (response) {
                    if (offset === 0) {
                        dispatch(resetData())
                    }
                    dispatch(setData(response))
                }
            } catch (e) {
                console.error('Failed to fetch media:', e)
            }
        }

        fetchData()
    }, [pathname, offset, initialLimit, limit, dispatch, getMedia])

    return { data, isLoading, isError, setOffset }
}

export default useFetchMedia
