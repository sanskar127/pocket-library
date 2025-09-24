import { RootState } from '@/store/store';
import { ImageInterface } from '@/types/types';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';

export default function ViewScreen() {
  const { id } = useLocalSearchParams();

  const data = useSelector((state: RootState) => state.response.data);
  const baseUrl = useSelector((state: RootState) => state.response.baseURL);

  // Handle id being string or string[]
  const itemId = Array.isArray(id) ? id[0] : id;

  const selectedItem = data.find((item) => item.id === itemId) as ImageInterface | undefined;

  if (!selectedItem) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white text-lg">Item not found</Text>
      </View>
    );
  }

  const { name, url } = selectedItem;

  return (
    <View className="flex-1 bg-black relative">
      <View className="absolute w-full top-0 p-4">
        <Text className="text-white text-lg font-semibold">{name}</Text>
      </View>
      <Image
        source={{ uri: baseUrl + url }}
        className="flex-1 w-full"
        resizeMode="contain"
      />
    </View>
  );
}
