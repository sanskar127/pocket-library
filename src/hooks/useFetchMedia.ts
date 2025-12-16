import { useGetMediaMutation } from '../api/mediaApi'
import { useCallback, useEffect, useState, useRef } from 'react'
import type { ItemType } from '../types/types'
import { useLocation } from 'react-router'
import { getLimit } from '../utils'

const useFetchMedia = () => {
  const [getMedia, { isLoading, isError }] = useGetMediaMutation()
  const [isRefreshing, setRefreshing] = useState(false)
  const [data, setData] = useState<ItemType[]>([])
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [offset, setOffset] = useState(0)

  const isInitialLoad = useRef(true)
  const { pathname } = useLocation()
  const { initialLimit, limit } = getLimit()

  // Update offset for pagination
  const updateOffset = () => {
    if (hasMore) setOffset(prev => prev + limit)
  }

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
    try {
      const currentLimit = offset === 0 ? initialLimit : limit
      const response: { data: ItemType[], hasMore: boolean } = await getMedia({ pathname, offset, limit: currentLimit }).unwrap()

      if (response) {
        setData(prev => [...prev, ...response.data])
        setHasMore(response.hasMore)
      }

    } catch (error) {
      console.error('Failed to fetch media:', error)
    }
  }, [pathname, getMedia, offset])

  // Trigger data fetch when the limit changes or initial fetch
  useEffect(() => {
    // if (limit && initialLimit) {
    fetchData()
    // }
  }, [fetchData])

  // Handle pull-to-refresh action
  const handleRefresh = async () => {
    setRefreshing(true)
    handleReset()
    await fetchData() // Manually trigger the data fetch again
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
