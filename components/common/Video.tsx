import type { FC } from 'react';
import type { VideoInterface } from '@/types/types';
import { formatTime, formatSize, formatRelativeTime } from '@/utils/utils';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image as RNImage } from 'react-native';
import { Link } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Video: FC<{ details: VideoInterface }> = ({ details }) => {
  const { id, thumbnail, name, duration, modifiedAt, size, type } = details;
  const baseUrl = useSelector((state: RootState) => state.response.baseURL)

  return (
    <View className="w-full mb-4">
      <Link href={`/watch/${id}`} className="w-full aspect-[16/9] bg-black relative">
        {thumbnail ? (
          <RNImage
            source={{ uri: (baseUrl + thumbnail) }}
            resizeMode="contain"
            className="absolute top-0 left-0 w-full h-full"
          />
        ) : (
          <View className="absolute top-0 left-0 w-full h-full items-center justify-center border-2 border-primary">
            <Ionicons name="videocam-outline" size={64} color="#4f46e5" />
          </View>
        )}

        <Text className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
          {formatRelativeTime(modifiedAt)}
        </Text>
        <Text className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
          {formatTime(duration)}
        </Text>
      </Link>

      <View className="px-3 py-2">
        <Text numberOfLines={2} className="text-base font-semibold text-white">
          {name}
        </Text>
        <Text className="text-xs text-gray-300 mt-0.5">
          {formatSize(size)} • {type}
        </Text>
      </View>
    </View>
  );
};

export default Video;
