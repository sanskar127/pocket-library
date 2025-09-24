import React from 'react';
import { Text, View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Header({ title }: { title: string }) {

  return (
    <View className='bg-background'>
      <StatusBar
        translucent
        animated
      />

      <View
        className="h-15 px-4 py-6 flex-row items-center gap-4"
        style={{ marginTop: Platform.OS === 'android' ? 30 : 0 }} // Avoid overlap on Android
      >
        <Text className="text-white text-xl font-bold">{title}</Text>
      </View>
    </View>
  );
}
