import { useGetMediaMutation } from '@/api/mediaApi'
import { RootState } from '@/store/store'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ItemType } from '@/types/types'
import { setFilter } from '@/features/filterSlice'

const LIMIT = 7
const FILTER_KEY = 'filter'

const useFetchMedia = () => {
  const [getMedia, { isLoading, isError }] = useGetMediaMutation()
  const [data, setData] = useState<ItemType[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [isRefreshing, setRefreshing] = useState(false)
  const dispatch = useDispatch()

  const routeHistory = useSelector((state: RootState) => state.localRouter.history)
  const filter = useSelector((state: RootState) => state.filter)
  const pathname = routeHistory.join('/')

  // Pagination helper
  const updateOffset = () => {
    if (hasMore) setOffset(prev => prev + LIMIT)
  }

  // Initialize or sync filter from AsyncStorage
  useEffect(() => {
    const initFilter = async () => {
      try {
        const storedFilter = await AsyncStorage.getItem(FILTER_KEY)
        if (storedFilter) {
          dispatch(setFilter(JSON.parse(storedFilter)))
        } else {
          await AsyncStorage.setItem(FILTER_KEY, JSON.stringify(filter))
        }
      } catch (err) {
        console.error('Failed to load filter:', err)
      }
    }
    initFilter()
  }, [dispatch, filter])

  // Reset data when pathname or filter changes
  useEffect(() => {
    setData([])
    setHasMore(false)
    setOffset(0)
  }, [pathname, filter])

  // Fetch media data
  const fetchData = useCallback(async () => {
    try {
      const response = await getMedia({ pathname, offset, limit: LIMIT, sorting: filter }).unwrap()
      setData(prev => [...prev, ...response.data])
      setHasMore(response.hasMore)
    } catch (err) {
      console.error('Failed to fetch media:', err)
    }
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
