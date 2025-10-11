import { RootState } from '@/store/store';
import { RenderItemInterface, VideoInterface } from '@/types/types';
// import { useEvent } from 'expo';
import Video from '@/components/common/Video';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Dimensions, Platform, Text, } from 'react-native';
import { useSelector } from 'react-redux';
import ItemListing from '@/components/ui/ItemListing';
import { useEffect, useState } from 'react';

const { width: deviceWidth } = Dimensions.get('window');

export default function WatchScreen() {
  const [entry, setEntry] = useState<VideoInterface | null>(null)
  const [related, setRelated] = useState<VideoInterface[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { id } = useLocalSearchParams();
  const entries = useSelector((state: RootState) => state.response.data)
  const baseURL = useSelector((state: RootState) => state.response.baseURL)

  useEffect(() => {
    setIsLoading(true);

    const videoEntry = entries.find(item => item.id === id) as VideoInterface;
    if (videoEntry) {
      setEntry(videoEntry);
      const relatedVideos = entries.filter(item => item.id !== videoEntry.id) as VideoInterface[];
      setRelated(relatedVideos);
    }

    setIsLoading(false);
  }, [entries, id]);

  const player = useVideoPlayer((baseURL + entry?.url), player => {
    player.loop = true;
    player.play();
  });

  // If entry is not found, render a loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  const renderItem: RenderItemInterface = ({ item }) => {
    if (item.type.startsWith('video/')) {
      return <Video details={item as VideoInterface} />;
    }

    return null;
  };

  return (
    <View className='bg-background flex flex-1 w-full'>
      <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
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
