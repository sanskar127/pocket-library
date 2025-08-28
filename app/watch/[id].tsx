import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function WatchScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Watching item with ID: {id}</Text>
    </View>
  );
}
