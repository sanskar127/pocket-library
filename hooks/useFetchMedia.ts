import { useGetMediaMutation } from '@/api/mediaApi'
import { RootState } from '@/store/store'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setData, resetData } from "@/features/responseSlice"
// import { getLimit } from '@/utils/utils'
// import { Dimensions } from 'react-native'

const useFetchMedia = () => {
    const [getMedia, { isLoading, isError }] = useGetMediaMutation()
    const dispatch = useDispatch()

    const routeHistory = useSelector((state: RootState) => state.localRouter.history)
    const pathname = useMemo(() => routeHistory.join('/'), [routeHistory])

    // const [deviceWidth, setDeviceWidth] = useState(Dimensions.get('window').width)

    // const { initialLimit, limit } = useMemo(() => getLimit(deviceWidth), [deviceWidth])

    // // Handle screen dimension changes
    // useEffect(() => {
    //     const handleDimensionChange = ({ window }: { window: any }) => {
    //         const newWidth = window.width
    //         if (Math.abs(newWidth - deviceWidth) > 10) {
    //             setDeviceWidth(newWidth)
    //         }
    //     }

    //     const subscription = Dimensions.addEventListener('change', handleDimensionChange)
    //     return () => {
    //         subscription?.remove?.()
    //     }
    // }, [deviceWidth])

    // Reset data on pathname change
    useEffect(() => {
        dispatch(resetData())
    }, [pathname, dispatch])

    // Fetch media data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getMedia(pathname).unwrap()

                if (response) dispatch(setData(response.data))
            } catch (e) {
                console.error('Failed to fetch media:', e)
            }
        }

        fetchData()
    }, [pathname, getMedia, dispatch])

    return {
        isLoading,
        isError
    }
}

export default useFetchMedia
