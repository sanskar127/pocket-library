import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { setBaseURL } from '@/features/responseSlice';

export default function Welcome() {
  const [url, setUrl] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handlePress = () => {
    dispatch(setBaseURL(url));
    setUrl('');
    router.push('/dashboard');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 items-center justify-center px-4 bg-background">
          <Text className="text-white text-6xl font-bold text-center mb-12">Welcome</Text>

          <View className="w-full max-w-md gap-4">
            <Text className="text-white text-lg mb-1 text-center">
              Enter Pocket Server IP Address:
            </Text>

            <View className="flex-row items-center bg-white/10 border border-white/20 rounded-lg px-4">
              <TextInput
                placeholder="e.g. http://192.168.0.1:3000"
                value={url}
                onChangeText={setUrl}
                onSubmitEditing={handlePress}
                returnKeyType="done"
                placeholderTextColor="#A0A0A0"
                className="flex-1 py-4 pr-4 text-white text-base outline-none"
              />
              <TouchableOpacity className="pl-2" onPress={handlePress}>
                <Ionicons name="arrow-forward-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
