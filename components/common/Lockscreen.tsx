import { FC, ReactNode, useCallback, useEffect, useState } from 'react'
import { AppState, AppStateStatus, Pressable, Text, View } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setIsAvailable, setIsEnable } from '@/features/lockSlice';

const Lockscreen: FC<{ children: ReactNode }> = ({ children }) => {
    const [isLocked, setIsLocked] = useState<boolean>(true)
    const isEnable = useSelector((state: RootState) => state.lock.isEnable)
    const dispatch = useDispatch<AppDispatch>()

    const authenticationAvailabilityStatus = useCallback(async () => {
        const compatibility = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        dispatch(setIsAvailable({ compatibility, enrolled }));
    }, [dispatch]);

    // Execute at once when mounts
    useEffect(() => {
        dispatch(setIsEnable());
        authenticationAvailabilityStatus();
    }, [dispatch, authenticationAvailabilityStatus])

    // When App Goes Background
    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            // Handle the background state
            if (isEnable && nextAppState === 'background') setIsLocked(true)
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Clean up the subscription on component unmount
        return () => {
            subscription.remove();
        };
    }, [dispatch, isEnable]);

    const handleAuthenticate = async () => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock to use Pocket Media Library',
                fallbackLabel: 'Use PIN',
            });

            if (result.success) setIsLocked(false)
        } catch (error) {
            console.error('Authentication failed:', error);
        }
    };

    return (
        <>
            <View
                style={{
                    display: (isEnable && isLocked) ? 'flex' : 'none',
                    position: 'absolute', // Fix position
                    zIndex: 100,
                    top: 0,              // Cover top of the screen
                    left: 0,             // Cover left side of the screen
                    right: 0,            // Cover right side of the screen
                    bottom: 0,           // Cover bottom of the screen
                }}
                className="bg-black flex justify-center items-center"
            >
                <Pressable onPress={handleAuthenticate}>
                    <Text className="text-primary text-lg font-light">Unlock</Text>
                </Pressable>
            </View>
            {children}
        </>
    )
}

export default Lockscreen
