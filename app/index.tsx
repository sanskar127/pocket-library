import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { setBaseURL } from '@/features/responseSlice';
import Divider from '@/components/ui/Divider';
import { useHistoryStorage } from '@/hooks/useHistoryStorage';

export default function Welcome() {
  const [url, setUrl] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  // Use the custom hook to manage history state and persistence
  const { history, addHistoryEntry, removeHistoryEntry, loading } = useHistoryStorage();

  const handlePress = () => {
    if (!url.trim()) return;
    dispatch(setBaseURL(url));
    addHistoryEntry(url); // <-- Use the hook's function
    setUrl('');
    router.push('/dashboard');
  };

  const handleRemove = (entry: string) => {
    removeHistoryEntry(entry);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-white">Loading history...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <View className="flex-1 justify-center items-center px-6">
        <View className="w-full max-w-md">
          <Text className="text-white text-5xl font-extrabold text-center mb-10">
            Welcome
          </Text>

          <Text className="text-white text-base mb-3">
            Enter Pocket Server IP Address:
          </Text>

          <View className="flex-row items-center gap-2">
            {/* Input Field Container */}
            <View className="flex-1 h-16 flex-row items-center bg-white/10 border border-white/20 rounded-lg px-2">
              <TextInput
                className="flex-1 text-white text-base"
                placeholder="e.g. http://192.168.0.1:3000"
                placeholderTextColor="#A0A0A0"
                value={url}
                onChangeText={setUrl}
                onSubmitEditing={handlePress}
                returnKeyType="done"
              />
              <TouchableOpacity
                onPress={handlePress}
                className="ml-2 p-1.5 rounded-md active:opacity-75"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="arrow-forward-outline" size={22} color="white" />
              </TouchableOpacity>
            </View>

            {/* Scan Button */}
            <Pressable
              // onPress={handleScan}
              className="h-16 w-16 items-center justify-center rounded-lg bg-white/10 border border-white/20 active:opacity-75"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="scan" size={26} color="white" />
            </Pressable>
          </View>


        </View>

        <Divider />

        <View className="w-full max-w-md">
          {Object.keys(history).length === 0 ? (
            <Text className="text-white/60 text-center text-sm italic">
              No history found.
            </Text>
          ) : (
            <View className="space-y-2">
              <Text className='text-gray-500 text-lg font-semibold mb-4'>Past Connections</Text>
              {Object.keys(history).map((item) => (
                <Pressable
                  key={item}
                  onPress={() => {
                    dispatch(setBaseURL(item));
                    router.push('/dashboard');
                  }}
                  className="flex-row items-center justify-between bg-white/30 p-4 rounded-md"
                >
                  <Text className="text-white text-xl">{item}</Text>

                  {/* Prevent press propagation to parent */}
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation(); // <-- Important!
                      handleRemove(item);
                    }}
                  >
                    <Ionicons name="close" size={24} color="#fff" />
                  </Pressable>
                </Pressable>

              ))}
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}