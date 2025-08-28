import { useDispatch, useSelector } from "react-redux"
import { addRouteToHistory, removeLastRoute } from "@/features/localRouterSlice"
import { RootState } from "@/store/store"
import { BackHandler } from "react-native"
import { usePathname, useRouter } from "expo-router"
import { useEffect, useMemo } from "react"

const useLocalRouter = (): [string, string, (path: string) => void, () => void] => {
  const dispatch = useDispatch()
  const router = useRouter()
  const nativePathname = usePathname()
  const routeHistory = useSelector((state: RootState) => state.localRouter.history)
  const currentPath = routeHistory.length ? routeHistory[routeHistory.length - 1] : '/'
  const pathname = useMemo(() => routeHistory.join('/'), [routeHistory])

  console.log(routeHistory)

  useEffect(() => {
    const backAction = () => {
      if ((nativePathname === '/dashboard') && routeHistory.length === 0) BackHandler.exitApp()
      else if (nativePathname === '/dashboard') dispatch(removeLastRoute())
      else router.back()
      return true; // Prevent default behavior (going back)
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, [routeHistory.length, dispatch, nativePathname, router]);

  const navigateTo = (path: string) => dispatch(addRouteToHistory(path))
  const goBack = () => dispatch(removeLastRoute())

  return [pathname, currentPath, navigateTo, goBack]
}

export default useLocalRouter
