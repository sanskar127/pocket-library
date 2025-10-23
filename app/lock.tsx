import React, { useEffect, useState } from 'react';
import { Text, Pressable, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'expo-router';
import { setIsLocked } from '@/features/lockSlice';

const LockScreen = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const prevRoute = useSelector((state: RootState) => state.lock.prevRoute);
  const router = useRouter();
  const dispatch = useDispatch()

  const handleAuthenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock to Access Content',
        fallbackLabel: 'Use PIN',
      });

      if (result.success) {
        router.replace(prevRoute);
        dispatch(setIsLocked(false))
      } 
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  useEffect(() => {
    // Check if biometric authentication is available
    LocalAuthentication.hasHardwareAsync()
      .then((result) => setIsBiometricSupported(result))
      .catch((error) => console.error('Biometric hardware check failed:', error));
  }, []);

  return (
    <View className="flex-1 justify-center items-center">
      {isBiometricSupported ? (
        <>
          <Pressable 
            onPress={handleAuthenticate}>
            <Text className="text-primary text-lg font-light">Unlock</Text>
          </Pressable>
        </>
      ) : (
        <Text className="text-gray-800">Biometric authentication is not available on this device</Text>
      )}
    </View>
  );
};

export default LockScreen;
