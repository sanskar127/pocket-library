import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, Dimensions, Text, Vibration, View } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { useHistoryStorage } from '@/hooks/useHistoryStorage';
import { setBaseURL } from '@/features/responseSlice';

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Use the custom hook to manage history state and persistence
  const { addHistoryEntry, loading } = useHistoryStorage();

  const { width, height } = Dimensions.get('window');

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-evenly p-4">
        <Text className="text-center p-2 rounded-lg text-base text-white bg-black/50">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleScan = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      dispatch(setBaseURL(data));
      addHistoryEntry(data);
      router.push('/dashboard');
      Vibration.vibrate(50);
      setTimeout(() => setScanned(false), 3000);
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      {/* Message */}
      {/* <Text className="text-center p-2 rounded-lg text-base text-white bg-black/50">
        Scan QR Code
      </Text> */}

      {/* QR Scanner Viewport */}
      <View
        className="mt-24 border-[3px] border-gray-400/50 rounded-xl"
        style={{
          width: 280,
          height: 280,
          shadowColor: '#8b5cf6',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 10,
        }}
      />

      {/* Fullscreen Camera in Background */}
      <CameraView
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width,
          height,
          zIndex: -1,
        }}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code39', 'code128'],
        }}
        onBarcodeScanned={handleScan}
      />
    </View>
  );
}
