import React, { useCallback } from 'react';
import useFetchMedia from '@/hooks/useFetchMedia';
import { RenderItemInterface } from '@/types/types';
import Directory from '@/components/common/Directory';
import Image from '@/components/common/Image';
import Video from '@/components/common/Video';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, View, ActivityIndicator, Text, RefreshControl, Pressable } from 'react-native';
import FilterBottomSheet from '@/components/ui/FilterBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

export default function HomeScreen() {
  const { data, isLoading, isRefreshing, handleRefresh, updateOffset, isError } = useFetchMedia();

  const filterSheetRef = React.useRef<BottomSheetModal>(null);

  // Render item function
  const renderItem: RenderItemInterface = ({ item }) => {
    if (item.type === 'directory') return <Directory details={item} />;
    if (item.type.startsWith('image/')) return <Image details={item} />;
    if (item.type.startsWith('video/')) return <Video details={item} />;
    return null;
  };

  const handleFilterPress = useCallback(() => filterSheetRef.current?.present(), [])

  return (
    <FilterBottomSheet ref={filterSheetRef}>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <View className="flex flex-row items-center justify-end py-2 px-2">
            <Pressable onPress={handleFilterPress} className="flex-row items-center gap-1 bg-white rounded-md p-3">
              <Ionicons name="funnel-outline" size={20} color="black" />
            </Pressable>
          </View>
        }
        onEndReached={updateOffset}
        onEndReachedThreshold={0.2}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : isError ? (
            <Text>Error loading data</Text>
          ) : null
        }
      />
    </FilterBottomSheet>
  );
}
