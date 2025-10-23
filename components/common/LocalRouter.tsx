import useLocalRouter from '@/hooks/useLocalRouter';
import { FC, ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'expo-router';
import { AppState, AppStateStatus } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setPrevRoute, setIsEnable, setIsLocked } from '@/features/lockSlice';
import { AppDispatch, RootState } from '@/store/store';

const LocalRouter: FC<{ children: ReactNode }> = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const isEnable = useSelector((state: RootState) => state.lock.isEnable)
    const isLocked = useSelector((state: RootState) => state.lock.isLocked)

    useEffect(() => {
        dispatch(setIsEnable())
    }, [dispatch])

    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (isLocked && isEnable) {
                dispatch(setPrevRoute(pathname));
                router.replace('/lock');
            } else if (nextAppState === 'background') {
                dispatch(setIsLocked(true))
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Clean up the subscription on component unmount
        return () => {
            subscription.remove();
        };
    }, [dispatch, pathname, router, isEnable, isLocked]);

    useLocalRouter();

    return (
        <>
            {children}
        </>
    )
}

export default LocalRouter
