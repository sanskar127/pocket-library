import { useDispatch, useSelector } from "react-redux"
import { addRouteToHistory, removeLastRoute } from "@/features/localRouterSlice"
import { RootState } from "@/store/store"
import { Alert, BackHandler } from "react-native"
import { useEffect, useMemo } from "react"

const useLocalRouter = (): [string, string, (path: string) => void, () => void] => {
  const dispatch = useDispatch()
  const routeHistory = useSelector((state: RootState) => state.localRouter.history)
  const currentPath = routeHistory.length ? routeHistory[routeHistory.length - 1] : '/'
  const pathname = useMemo(() => routeHistory.join('/'), [routeHistory])

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true; // Prevent default behavior (going back)
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, []);

  const navigateTo = (path: string) => dispatch(addRouteToHistory(path))
  const goBack = () => dispatch(removeLastRoute())

  return [pathname, currentPath, navigateTo, goBack]
}

export default useLocalRouter
