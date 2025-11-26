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
import { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '@/features/filterSlice';

const typeOptions = [
  { id: 0, title: "Name", value: "name" },
  { id: 1, title: "Date", value: "date" },
  { id: 2, title: "Size", value: "size" },
] as const;

export default function HomeScreen() {
  const { data, isLoading, isRefreshing, handleRefresh, updateOffset, isError } = useFetchMedia();
  const globalFilter = useSelector((state: RootState) => state.filter.filter);
  const filterSheetRef = React.useRef<BottomSheetModal>(null);
  const dispatch = useDispatch()

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
          <View className="mb-3 flex-row items-center w-full px-4 gap-2">
            {/* Filter Icon Button */}
            <Pressable
              onPress={handleFilterPress}
              className="flex-1 bg-[#1F1F1F] rounded-md items-center py-2 active:opacity-80"
            >
              <Ionicons name="funnel" size={20} color="#fff" />
            </Pressable>

            {/* Full-Width Filter Buttons */}
            {globalFilter &&
              typeOptions.map(item => {
                const isSelected = item.value === globalFilter.type

                return (
                  <Pressable
                    key={item.id}
                    onPress={() => dispatch(setFilter({ ...globalFilter, type: item.value }))}
                    className={`flex-1 rounded-md items-center py-2 active:opacity-80 ${isSelected ? "bg-white" : "bg-[#1F1F1F]"
                      }`}
                  >
                    <Text className={`${isSelected ? "text-black" : "text-white"} font-medium`}>
                      {item.title}
                    </Text>
                  </Pressable>
                )
              })}
          </View>
        }
        onEndReached={updateOffset}
        onEndReachedThreshold={0.2}
        refreshControl={< RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : isError ? (
            <View>
              <Text className='text-white text-center text-lg font-semibold'>Error loading data</Text>
              <Text className='text-white text-center text-lg font-semibold'>Pull to Refresh</Text>
            </View>
          ) : null
        }
      />
    </FilterBottomSheet >
  );
}
