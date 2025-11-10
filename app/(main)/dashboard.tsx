import React, { useState, useEffect } from 'react';
import useFetchMedia from '@/hooks/useFetchMedia';
import { filterInterface, RenderItemInterface } from '@/types/types';
import Directory from '@/components/common/Directory';
import Image from '@/components/common/Image';
import Video from '@/components/common/Video';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, View, ActivityIndicator, Text, RefreshControl, Pressable, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const { data, isLoading, isRefreshing, handleRefresh, filter, setFilter, updateOffset, isError } = useFetchMedia();
  const [newFilter, setNewFilter] = useState<filterInterface>(filter);

  // Single snap point (just one for the bottom sheet)
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = ['40%'];

  // Render item function
  const renderItem: RenderItemInterface = ({ item }) => {
    if (item.type === 'directory') return <Directory details={item} />;
    if (item.type.startsWith('image/')) return <Image details={item} />;
    if (item.type.startsWith('video/')) return <Video details={item} />;
    return null;
  };

  // const handlePressable = () => bottomSheetRef.current?.expand();

  const handleSheetChanges = (index: number) => {
    console.log('Sheet changed to index:', index);
  };

  // Handle changes in filter values
  const handleFilterChange = () => {
    setFilter(newFilter);
    bottomSheetRef.current?.close();  // Close the bottom sheet
  };

  useEffect(() => {
    setNewFilter(filter);  // Ensure that newFilter syncs with the current filter
  }, [filter]);

  return (
    <GestureHandlerRootView>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <View>
            <Pressable>
              <Text>
                <Ionicons name="funnel" size={13} color="currentColor" /> Filter
              </Text>
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

      {/* BottomSheet for Filters */}
      {/* <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} onChange={handleSheetChanges}>
        <BottomSheetView>
          <View>
            <Text>Choose Type:</Text>
            <Picker
              selectedValue={newFilter.type}
              onValueChange={(value) => setNewFilter({
                ...newFilter,
                type: value,  // Ensure type is always set
              })}
            >
              <Picker.Item label="Name" value="name" />
              <Picker.Item label="Date" value="date" />
              <Picker.Item label="Size" value="size" />
            </Picker>
          </View>

          <View>
            <Text>Choose Order:</Text>
            <Picker
              selectedValue={newFilter.order}
              onValueChange={(value) => setNewFilter({
                ...newFilter,
                order: value,  // Ensure order is always set
              })}
            >
              <Picker.Item label="Ascending" value="ascending" />
              <Picker.Item label="Descending" value="descending" />
            </Picker>
          </View>

          <View>
            <Text>Sort Directories First</Text>
            <Switch
              value={newFilter.sortDirectoryFirst}
              onValueChange={(value) => setNewFilter({
                ...newFilter,
                sortDirectoryFirst: value, // Ensure this is set
              })}
            />
          </View>

          <Pressable onPress={handleFilterChange}>
            <Text>Apply Filter</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet> */}
    </GestureHandlerRootView>
  );
}
