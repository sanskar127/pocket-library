import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';

export default function Header({ title }: { title: string }) {
  const navigation = useNavigation();

  return (
    <View style={{ height: 60, backgroundColor: '#6200ee', paddingHorizontal: 16, justifyContent: 'center' }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ color: 'white' }}>{'< Back'}</Text>
      </TouchableOpacity>
      <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
    </View>
  );
}
