import { RootState } from '@/store/store';
import { RenderItemInterface, VideoInterface } from '@/types/types';
// import { useEvent } from 'expo';
import Video from '@/components/common/Video';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, Dimensions, Platform, Text, FlatList, ActivityIndicator, } from 'react-native';
import { useSelector } from 'react-redux';
import useFetchMedia from '@/hooks/useFetchMedia';

const { width: deviceWidth } = Dimensions.get('window');

export default function WatchScreen() {
  const selectedMedia = useSelector((state: RootState) => state.content.selectedMedia)
  const baseURL = useSelector((state: RootState) => state.baseurl.baseURL)
  const { data, isLoading, updateOffset, isError } = useFetchMedia();

  const renderItem: RenderItemInterface = ({ item }) => {
    if (item.type.startsWith('video/') && item.id !== selectedMedia?.id) return <Video details={item as VideoInterface} />

    return null;
  };

  const player = useVideoPlayer((baseURL + selectedMedia?.url), player => {
    player.loop = true;
    player.play();
  });

  // const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  return (
    <View className='flex flex-1 w-full'>
      <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
      <View style={styles.controlsContainer}>
        <FlatList
          data={data}
          keyExtractor={(item: any) => item.id}
          renderItem={renderItem}
          onEndReached={updateOffset}
          onEndReachedThreshold={0.2}
          contentContainerStyle={{
            padding: 16,
            rowGap: 16,
          }}
          ListFooterComponent={
            isLoading ? (
              <View className="py-4">
                <ActivityIndicator size="small" color="#fff" />
              </View>
            ) : (isError ? (
              <View className="flex-1 justify-center items-center">
                <Text className="text-white mt-4">Error to Fetch Data</Text>
              </View>
            ) : null)
          }
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
