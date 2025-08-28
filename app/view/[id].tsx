import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function ViewScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Viewing item with ID: {id}</Text>
    </View>
  );
}
