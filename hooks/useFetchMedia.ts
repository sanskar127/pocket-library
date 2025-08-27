import { useGetMediaMutation } from '@/api/mediaApi'
import { RootState } from '@/store/store'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setData, resetData } from "@/features/responseSlice"

const useFetchMedia = () => {
    const [getMedia, { isLoading, isError }] = useGetMediaMutation()
    const dispatch = useDispatch()
    const routeHistory = useSelector((state: RootState) => state.localRouter.history)
    const data = useSelector((state: RootState) => state.response.data)
    const pathname = useMemo(() => routeHistory.join('/'), [routeHistory])
    const [offset, setOffset] = useState<number>(0)
    const limit = 6

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getMedia({ pathname, offset, limit }).unwrap()
                // Safely check and dispatch
                if (response) {
                    dispatch(resetData())
                    dispatch(setData(response))
                }
            } catch (e) {
                console.error('Failed to fetch media:', e)
            }
        }

        fetchData()
    }, [getMedia, pathname, offset, dispatch])

    return { data, isLoading, isError }
}

export default useFetchMedia
