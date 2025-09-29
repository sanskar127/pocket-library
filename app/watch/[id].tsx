import { RootState } from '@/store/store';
import { ItemType, RenderItemInterface, VideoInterface } from '@/types/types';
// import { useEvent } from 'expo';
import Video from '@/components/common/Video';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Dimensions, Platform, } from 'react-native';
import { useSelector } from 'react-redux';
import ItemListing from '@/components/ui/ItemListing';

const { width: deviceWidth } = Dimensions.get('window');

export default function WatchScreen() {
  const { id } = useLocalSearchParams();
  const entries = useSelector((state: RootState) => state.response.data)
  const baseURL = useSelector((state: RootState) => state.response.baseURL)

  const entry: VideoInterface = entries.find(item => item.id === id) as ItemType as VideoInterface
  // const url = baseURL + entry.url
  const related = entries.filter(item => item.id !== entry.id)
  console.log(related)

  // const player = useVideoPlayer(url, player => {
  //   player.loop = true;
  //   player.play();
  // });

  // const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

    const renderItem: RenderItemInterface = ({ item }) => {
    if (item.type.startsWith('video/')) {
      return <Video details={item as VideoInterface} />;
    }

    return null;
  };

  return (
    <View className='bg-background flex flex-1 w-full'>
      {/* <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture /> */}
      <View style={styles.controlsContainer}>
        <ItemListing data={related} renderItem={renderItem} />
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
