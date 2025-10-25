import { useGetMediaMutation } from '@/api/mediaApi'
import { RootState } from '@/store/store'
import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
// import { getLimit } from '@/utils/utils'
// import { Dimensions } from 'react-native'
import { ItemType } from '@/types/types'

const useFetchMedia = () => {
  const [getMedia, { isLoading, isError }] = useGetMediaMutation()
  const [isRefreshing, setRefreshing] = useState(false)
  const [data, setData] = useState<ItemType[]>([])
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [offset, setOffset] = useState(0)
  const limit = 7

  const routeHistory = useSelector((state: RootState) => state.localRouter.history)
  // Memoized pathname
  const pathname = useMemo(() => routeHistory.join('/'), [routeHistory])

  // const [deviceWidth, setDeviceWidth] = useState(Dimensions.get('window').width)

  // Memoized limits based on device width
  // const { initialLimit, limit } = useMemo(() => getLimit(deviceWidth), [deviceWidth])

  const isInitialLoad = useRef(true)

  // Update offset for pagination
  const updateOffset = () => {
    if (hasMore) {
      // setOffset(prev => prev + (prev === 0 ? initialLimit : limit))
      setOffset(prev => prev + 7)
    }
  }

  // Handle screen dimension changes
  // useEffect(() => {
  //   const handleDimensionChange = ({ window }: { window: any }) => {
  //     const newWidth = window.width
  //     if (Math.abs(newWidth - deviceWidth) > 10) {
  //       setDeviceWidth(newWidth)
  //     }
  //   }

  //   const subscription = Dimensions.addEventListener('change', handleDimensionChange)
  //   return () => {
  //     subscription?.remove?.()
  //   }
  // }, [deviceWidth])

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
      // const currentLimit = offset === 0 ? initialLimit : limit
      const response: { data: ItemType[], hasMore: boolean } = await getMedia({ pathname, offset, limit }).unwrap()

      if (response) {
        setData(prev => [...prev, ...response.data])
        setHasMore(response.hasMore)
      }

    } catch (error) {
      // console.error('Failed to fetch media:', error)
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
    isError,
  }
}

export default useFetchMedia
