import Directory from '@/components/common/Directory';
import Image from '@/components/common/Image';
import Video from '@/components/common/Video';
import useFetchMedia from '@/hooks/useFetchMedia';
import useLocalRouter from '@/hooks/useLocalRouter';
import { DirectoryInterface, ImageInterface, VideoInterface } from '@/types/types';
import { ScrollView, Text, View, SafeAreaView, ActivityIndicator, Button } from 'react-native';

export default function Dashboard() {
  const { data, isLoading, hasMore, updateOffset } = useFetchMedia();
  useLocalRouter()

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className='py-2'>
        <View className="w-full p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {data.map(item => {
            if (item.type === "directory") {
              return <Directory key={item.id} details={item as DirectoryInterface} />;
            }

            if (item.type.startsWith("image/")) {
              return <Image key={item.id} details={item as ImageInterface} />;
            }

            if (item.type.startsWith("video/")) {
              return <Video key={item.id} details={item as VideoInterface} />;
            }
          })}
          {hasMore && <Button title='more' onPress={(e) => {
            e.preventDefault()
            updateOffset()
          }
          } />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
