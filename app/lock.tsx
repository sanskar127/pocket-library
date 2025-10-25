import { Text, Pressable, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLocked } from '@/features/lockSlice';
import { useRouter } from 'expo-router';
import { RootState } from '@/store/store';

const LockScreen = () => {
  const dispatch = useDispatch()
  const prevRoute = useSelector((state: RootState) => state.lock.prevRoute)
  const router = useRouter()

  const handleAuthenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock to use Pocket Media Library',
        fallbackLabel: 'Use PIN',
      });

      if (result.success) {
        dispatch(setIsLocked(false))
        router.replace(prevRoute)
      }
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Pressable
        onPress={handleAuthenticate}>
        <Text className="text-primary text-lg font-light">Unlock</Text>
      </Pressable>
    </View>
  );
};

export default LockScreen;
