import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from 'expo-router';

export default function Header({ title }: { title: string }) {
  const navigation = useNavigation();

  return (
    <View className="h-15 bg-background px-4 py-6 flex-row items-center gap-4">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className="text-white">{'< Back'}</Text>
      </TouchableOpacity>
      <Text className="text-white text-xl font-bold">{title}</Text>
    </View>
  );
}
