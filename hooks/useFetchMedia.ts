import { useGetMediaMutation } from '@/api/mediaApi'
import { RootState } from '@/store/store'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { filterInterface, ItemType } from '@/types/types'

const useFetchMedia = () => {
  const [getMedia, { isLoading, isError }] = useGetMediaMutation()
  const [data, setData] = useState<ItemType[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [filter, setFilter] = useState<filterInterface>({
    type: 'date',
    order: 'descending',
    sortDirectoryFirst: true
  })
  const [offset, setOffset] = useState(0)
  const [isRefreshing, setRefreshing] = useState(false)

  const LIMIT = 7
  const FILTER_KEY = 'filter'

  const routeHistory = useSelector((state: RootState) => state.localRouter.history)
  const pathname = routeHistory.join('/')

  // Update offset for pagination
  const updateOffset = () => {
    if (hasMore) setOffset(prev => prev + LIMIT)
  }

  // Reset data on pathname or filter change
  useEffect(() => {
    setData([])
    setHasMore(false)
    setOffset(0)
  }, [pathname, filter])

  // Handling Filter/sorting
  const handleFilter = useCallback(async () => {
    try {
      const storedFilter = await AsyncStorage.getItem(FILTER_KEY)
      if (storedFilter === null) {
        await AsyncStorage.setItem(FILTER_KEY, JSON.stringify(filter))
      } else {
        setFilter(JSON.parse(storedFilter))
      }
    } catch (error) {
      console.error("Failed to Get Filter Data, ", error)
    }
  }, [filter])

  // Fetch media data based on current filter and offset
  const fetchData = useCallback(async () => {
    try {
      const response = await getMedia({ pathname, offset, limit: LIMIT, sorting: filter }).unwrap()
      setData(prev => [...prev, ...response.data])
      setHasMore(response.hasMore)
    } catch (error) {
      console.error('Failed to fetch media:', error)
    }
  }, [pathname, offset, filter, getMedia])

  useEffect(() => {
    // Fetch data only when filter is stable and after offset changes
    fetchData()
  }, [filter, offset, fetchData])

  // Handle refresh action
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
    filter,
    isRefreshing,
    setFilter,
    handleRefresh,
    updateOffset
  }
}

export default useFetchMedia
