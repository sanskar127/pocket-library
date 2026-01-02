import { useGetMediaQuery } from '../api/mediaApi'
import { useCallback, useEffect, useState, useRef } from 'react'
import type { ItemType } from '../types/types'
import { useLocation } from 'react-router'
import { getLimit } from '../utils'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store/store'
import { initFilter } from '../features/filterSlice'

const useFetchMedia = () => {
  const [data, setData] = useState<ItemType[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [isRefreshing, setRefreshing] = useState(false)

  const isInitialLoad = useRef(true)
  const { pathname } = useLocation()
  const limit = getLimit(offset)

  const dispatch = useDispatch<AppDispatch>()
  const { filter, loading } = useSelector((state: RootState) => state.filter)
  const { data: response, isLoading, isError, refetch } = useGetMediaQuery(
    { pathname, offset, limit, ...filter },
    { skip: loading || !filter }
  )

  // Update offset for pagination
  const updateOffset = () => {
    if (hasMore) setOffset(prev => prev + limit)
  }

  useEffect(() => {
    dispatch(initFilter());
  }, [dispatch]);

  const handleReset = () => {
    if (!isInitialLoad.current) {
      setData([])
      setHasMore(false)
      setOffset(0)
    }
    isInitialLoad.current = false
  }

  // Reset data on pathname change
  useEffect(() => {
    handleReset()
  }, [pathname])

  // Fetch media data
  const fetchData = useCallback(async () => {
    if (filter === null) return

    try {
      const { data, hasMore } = response
      setData(prev => [...prev, ...data])
      setHasMore(hasMore)
    } catch { console.log() }
  }, [filter, response])

  // Trigger data fetch when the limit changes or initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true)
    setData([])
    setHasMore(false)
    setOffset(0)
    refetch()
    await fetchData()
    setRefreshing(false)
  }

  return {
    data,
    isLoading,
    isRefreshing,
    handleRefresh,
    updateOffset,
    hasMore,
    isError,
  }
}

export default useFetchMedia
