import type { FC } from 'react';
import type { ImageInterface } from '@/types/types';
import { formatSize, formatRelativeTime } from '@/utils/utils';
import { Link } from 'expo-router';
import { View, Text, Image as RNImage } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Image: FC<{ details: ImageInterface }> = ({ details }) => {
  const { id, name, modifiedAt, size, type, url } = details;
  const baseUrl = useSelector((state: RootState) => state.response.baseURL)

  return (
    <View className="w-full mb-4">
      <Link href={`/view/${id}`} className="w-full aspect-[16/9] bg-black relative">
        <RNImage
          source={{ uri: (baseUrl + url) }}
          resizeMode="contain"
          className="absolute top-0 left-0 w-full h-full"
        />
        <Text className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
          {formatRelativeTime(modifiedAt)}
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

export default Image;
