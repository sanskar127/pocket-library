import useLocalRouter from '@/hooks/useLocalRouter';
import { FC, ReactNode, useCallback, useEffect } from 'react';
import { RelativePathString, usePathname, useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { AppState, AppStateStatus } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAvailable, setIsEnable, setIsLocked, setPrevRoute } from '@/features/lockSlice';
import { AppDispatch, RootState } from '@/store/store';

const LocalRouter: FC<{ children: ReactNode }> = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const isEnable = useSelector((state: RootState) => state.lock.isEnable);
    const isLocked = useSelector((state: RootState) => state.lock.isLocked);

    const authenticationAvailabilityStatus = useCallback(async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        console.log("compatible: ", compatible)
        console.log("enrolled: ", enrolled)

        dispatch(setIsAvailable(compatible && enrolled));
    }, [dispatch]);

    const handlePrevRoute = useCallback(() => {
        if (pathname !== "/lock") dispatch(setPrevRoute(pathname as RelativePathString));
    }, [dispatch, pathname])

    // Execute at once when mounts
    useEffect(() => {
        dispatch(setIsEnable());
        authenticationAvailabilityStatus();
    }, [dispatch, authenticationAvailabilityStatus])

    // When App Locked
    useEffect(() => {
        if (isEnable && isLocked) {
            handlePrevRoute();
            router.replace('/lock');
        }
    }, [handlePrevRoute, isEnable, isLocked, router])

    // When App Goes Background
    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            // Handle the background state
            if (isEnable && nextAppState === 'background') dispatch(setIsLocked(true));
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Clean up the subscription on component unmount
        return () => {
            subscription.remove();
        };
    }, [dispatch, isEnable]);

    useLocalRouter();

    return <>{children}</>;
};

export default LocalRouter;
