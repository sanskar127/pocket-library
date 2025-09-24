import { RootState } from '@/store/store';
import { ItemType } from '@/types/types';
// import { Video } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function WatchScreen() {
  const { id } = useLocalSearchParams();
  const entries = useSelector((state: RootState) => state.response.data)
  const baseURL = useSelector((state: RootState) => state.response.baseURL)

  const {name, url} = entries.find(item => item.id === id) as ItemType

  return (
    <View className='bg-background flex flex-1 w-full'>
      {/* <Video
        source={{ uri: baseURL + url}} // URL or local file path
        style={styles.video}
        useNativeControls={true} // Show controls
        // resizeMode=  // How the video is resized to fit the screen
        // shouldPlay={true} // Start the video automatically
        isLooping={false} // Loop video or not
        onError={(e) => console.log('Video Error', e)} // Error handling
      /> */}
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
    width: '100%',
    height: '100%', // Set the height you need
  },
});
