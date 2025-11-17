import { RootState } from '@/store/store';
import { RenderItemInterface, VideoInterface } from '@/types/types';
// import { useEvent } from 'expo';
import Video from '@/components/common/Video';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, Dimensions, Platform, Text, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import useFetchMedia from '@/hooks/useFetchMedia';
import { formatRelativeTime, formatSize } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { useGetSelectedMediaMutation } from '@/api/mediaApi';
import { useLocalSearchParams } from 'expo-router';
import Download from '@/components/ui/Download';

const { width: deviceWidth } = Dimensions.get('window');

export default function WatchScreen() {
  const [getSelectedMedia] = useGetSelectedMediaMutation()
  const { data, isLoading, updateOffset, isError } = useFetchMedia();
  const [selectedMedia, setSelectedMedia] = useState<VideoInterface | null>(null)
  const baseURL = useSelector((state: RootState) => state.baseurl.baseURL)
  const routeHistory = useSelector((state: RootState) => state.localRouter.history)
  const { id } = useLocalSearchParams() as { id: string }
  const pathname = routeHistory.join('/')

  useEffect(() => {
    (async () => {
      try {
        const response = await getSelectedMedia({ id, pathname }).unwrap()
        setSelectedMedia(response.data)
      } catch (error) {
        console.error('Failed to fetch media:', error)
      }
    })()
  }, [getSelectedMedia, id, pathname])

  const url = baseURL + selectedMedia?.url

  const renderItem: RenderItemInterface = ({ item }) => {
    if (item.type.startsWith('video/') && item.id !== selectedMedia?.id) return <Video details={item as VideoInterface} />
    return null;
  };

  const headerComponent = () => (
    <View>
      <Text className='text-gray-600 text-lg font-light pl-2'>related videos</Text>
    </View>
  )

  const footerComponent = () => (
    isLoading ? (
      <View className="py-4">
        <ActivityIndicator size="small" color="#fff" />
      </View>
    ) : (isError ? (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white mt-4">Error to Fetch Data</Text>
      </View>
    ) : null)
  )

  const player = useVideoPlayer(url, player => {
    player.loop = true;
    player.play();
  });

  // const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  return (
    <View className='flex flex-1 w-full'>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />

      {/* Video Info Section */}
      <View className="px-4 py-3">
        <Text className="text-white text-lg font-semibold mb-1">
          {selectedMedia?.name}
        </Text>

        <View className='flex flex-row justify-between'>
          <Text className="text-gray-400 text-sm">
            {formatRelativeTime(selectedMedia?.modifiedAt)} • {selectedMedia?.type}
          </Text>
          <Download entry={{ ...selectedMedia as VideoInterface, url }}>
            <Text className="text-white text-sm font-medium">
              Download ({formatSize(selectedMedia?.size)})
            </Text>
          </Download>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <FlatList
          data={data}
          keyExtractor={(item: any) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={headerComponent}
          onEndReached={updateOffset}
          onEndReachedThreshold={0.2}
          contentContainerStyle={{
            // padding: 16,
            // rowGap: 16,
          }}
          ListFooterComponent={footerComponent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    backgroundColor: "#000000",
    marginTop: Platform.OS === 'android' ? 42 : 0,
    width: deviceWidth,
    aspectRatio: 16 / 9
  },
  controlsContainer: {
    padding: 10,
  },
});
