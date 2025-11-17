import { RootState } from '@/store/store';
import { useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { GestureHandlerRootView, PinchGestureHandler, PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler';

const MAX_SCALE = 3;
const MIN_SCALE = 1;

export default function ViewScreen() {
  const baseUrl = useSelector((state: RootState) => state.baseurl.baseURL);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);

  const onPinchEvent = (event: PinchGestureHandlerGestureEvent) => {
    let newScale = event.nativeEvent.scale;
    if (newScale > MAX_SCALE) {
      newScale = MAX_SCALE;
    } else if (newScale < MIN_SCALE) {
      newScale = MIN_SCALE;
    }
    setScale(newScale);
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  // if (!selectedItem) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white text-lg">Feeds Screen not Implemented Yet</Text>
        {/* <Text className="text-white text-lg">Item not found</Text> */}
      </View>
    );
  // }

  // const { name, url } = selectedItem;

  // return (
  //   <GestureHandlerRootView style={{ flex: 1 }}>
  //     <PinchGestureHandler onGestureEvent={onPinchEvent}>
  //       <View className="flex-1 bg-black relative">
  //         <View className="absolute w-full top-0 p-4">
  //           <Text className="text-white text-lg font-semibold">{name}</Text>
  //         </View>
  //         {loading && (
  //           <ActivityIndicator size="large" color="#fff" style={{ position: 'absolute', top: '50%', left: '50%' }} />
  //         )}
  //         <Image
  //           source={{ uri: baseUrl + url }}
  //           className="flex-1 w-full"
  //           resizeMode="contain"
  //           style={{ transform: [{ scale }] }}
  //           onLoad={handleImageLoad}
  //           accessibilityLabel={name}
  //         />
  //       </View>
  //     </PinchGestureHandler>
  //   </GestureHandlerRootView>
  // );
}
