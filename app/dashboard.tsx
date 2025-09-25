import React from 'react';
import { FlatList, Text, View, ActivityIndicator } from 'react-native';
import Directory from '@/components/common/Directory';
import Image from '@/components/common/Image';
import Video from '@/components/common/Video';
import useFetchMedia from '@/hooks/useFetchMedia';
import useLocalRouter from '@/hooks/useLocalRouter';
import { DirectoryInterface, ImageInterface, VideoInterface } from '@/types/types';

export default function Dashboard() {
  const { data, isLoading, hasMore, updateOffset } = useFetchMedia();
  useLocalRouter();

  if (isLoading && data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Loading...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'directory') {
      return <Directory details={item as DirectoryInterface} />;
    }

    if (item.type.startsWith('image/')) {
      return <Image details={item as ImageInterface} />;
    }

    if (item.type.startsWith('video/')) {
      return <Video details={item as VideoInterface} />;
    }

    return null;
  };

  const keyExtractor = (item: any) => item.id;

  const handleEndReached = () => {
    if (hasMore) {
      updateOffset();
    }
  };

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.2}
      contentContainerStyle={{
        padding: 16,
        backgroundColor: '#1e1e1e', // or use className if you're using Tailwind plugin for RN
        rowGap: 16,
      }}
      ListFooterComponent={
        hasMore ? (
          <View className="py-4">
            <ActivityIndicator size="small" color="#fff" />
          </View>
        ) : null
      }
    />
  );
}
