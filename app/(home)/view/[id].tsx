import { RootState } from '@/store/store';
import { View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';

export default function ViewScreen() {
  const baseUrl = useSelector((state: RootState) => state.baseurl.baseURL);
  const selectedItem = useSelector((state: RootState) => state.content.selectedMedia)

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
