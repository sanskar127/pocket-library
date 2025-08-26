import { useDispatch, useSelector } from "react-redux"
import { addRouteToHistory, removeLastRoute } from "@/features/localRouterSlice"
import { RootState } from "@/store/store"
import { useMemo } from "react"

const useLocalRouter = (): [string, (path: string) => void, () => void] => {
  const dispatch = useDispatch()
  const routeHistory = useSelector((state: RootState) => state.localRouter.history)

  const currentPath = useMemo(() => routeHistory.join('/'), [routeHistory])

  const navigateTo = (path: string) => dispatch(addRouteToHistory(path))
  const goBack = () => dispatch(removeLastRoute())

  return [currentPath, navigateTo, goBack]
}

export default useLocalRouter
