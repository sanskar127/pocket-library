import { useGetMediaMutation } from '@/api/mediaApi'
import { AppDispatch, RootState } from '@/store/store'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ItemType } from '@/types/types'
import { initFilter } from '@/features/filterSlice'

const LIMIT = 7
const useFetchMedia = () => {
  const [getMedia, { isLoading, isError }] = useGetMediaMutation()
  const [data, setData] = useState<ItemType[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [isRefreshing, setRefreshing] = useState(false)

  const routeHistory = useSelector((state: RootState) => state.localRouter.history)
  const filter = useSelector((state: RootState) => state.filter.filter)
  const pathname = routeHistory.join('/')
  const dispatch = useDispatch<AppDispatch>()

  // Pagination helper
  const updateOffset = () => {
    if (hasMore) setOffset(prev => prev + LIMIT)
  }

  useEffect(() => {
    dispatch(initFilter());
  }, [dispatch]);

  // Reset data when pathname or filter changes
  useEffect(() => {
    setData([])
    setHasMore(false)
    setOffset(0)
  }, [pathname, filter])

  // Fetch media data
  const fetchData = useCallback(async () => {
    if (filter === null) return

    try {
      const response = await getMedia({ pathname, offset, limit: LIMIT, sorting: filter }).unwrap()
      setData(prev => [...prev, ...response.data])
      setHasMore(response.hasMore)
    } catch { }
  }, [pathname, offset, filter, getMedia])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true)
    setData([])
    setHasMore(false)
    setOffset(0)
    await fetchData()
    setRefreshing(false)
  }

  return {
    data,
    isLoading,
    isError,
    isRefreshing,
    handleRefresh,
    updateOffset
  }
}

export default useFetchMedia
