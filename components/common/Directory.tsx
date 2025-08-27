import type { FC } from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { DirectoryInterface } from '../../types/types';
import LocalLink from './LocalLink';
import { Text, View } from 'react-native';

const Directory: FC<{ details: DirectoryInterface }> = ({ details }) => {
  const { name, url } = details;

  return (
    <View className="w-full mb-4">
      <LocalLink
        to={url}
        className="w-full aspect-[16/9] items-center justify-center bg-primary"
      >
        <Ionicons name="folder-open" size={96} color="currentColor" />
      </LocalLink>
      <View className="px-3 py-2">
        <Text
          numberOfLines={2}
          className="text-base font-semibold text-white"
        >
          {name}
        </Text>
      </View>
    </View>
  );
};

export default Directory;
