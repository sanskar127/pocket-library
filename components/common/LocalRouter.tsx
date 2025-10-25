import { FC, ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { popSelectedMedia, removeLastRoute } from "@/features/localRouterSlice"
import { RootState } from "@/store/store"
import { BackHandler } from "react-native"
import { usePathname, useRouter } from "expo-router"

const LocalRouter: FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const nativePathname = usePathname()
  const routeHistory = useSelector((state: RootState) => state.localRouter.history)
  const selectedMediaStack = useSelector((state: RootState) => state.localRouter.selectedMediaStack)
  //   const currentPath = routeHistory.length ? routeHistory[routeHistory.length - 1] : '/'
  //   const pathname = useMemo(() => routeHistory.join('/'), [routeHistory])

  useEffect(() => {
    const backAction = () => {
      if ((nativePathname === '/dashboard') && routeHistory.length === 0) BackHandler.exitApp()
      else if (nativePathname === '/dashboard') dispatch(removeLastRoute())
      else if (nativePathname.startsWith('/watch') && selectedMediaStack.length !== 0) dispatch(popSelectedMedia())
      else router.back()
      return true; // Prevent default behavior (going back)
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, [routeHistory.length, dispatch, nativePathname, router, selectedMediaStack]);

  //   const navigateTo = (path: string) => dispatch(addRouteToHistory(path))
  //   const goBack = () => dispatch(removeLastRoute())
  return children
};

export default LocalRouter;
