import Directory from '@/components/common/Directory';
import Image from '@/components/common/Image';
import Video from '@/components/common/Video';
import useFetchMedia from '@/hooks/useFetchMedia';
import useLocalRouter from '@/hooks/useLocalRouter';
import { DirectoryInterface, ImageInterface, VideoInterface } from '@/types/types';
import { ScrollView, Text, View, ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

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

  // Scroll handler to detect when the user is near the bottom
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const visibleHeight = event.nativeEvent.layoutMeasurement.height;

    // Trigger fetching when near the bottom of the scroll
    if (contentOffsetY + visibleHeight >= contentHeight - 20) {
      if (hasMore) updateOffset()
    }
  };

  return (
    <ScrollView
      className="w-full p-4 bg-background grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      scrollEventThrottle={400} // Control the frequency of the onScroll event
      onScroll={handleScroll}
    >
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
    </ScrollView>
  );
}
