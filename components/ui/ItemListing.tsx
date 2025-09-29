import { FlatList, Text, View, ActivityIndicator } from 'react-native';
import useFetchMedia from '@/hooks/useFetchMedia';
import { FC } from 'react';
import { ItemListingPropsInterface } from '@/types/types';

const ItemListing: FC<ItemListingPropsInterface> = ({ data, renderItem }) => {
  const { isLoading, hasMore, updateOffset } = useFetchMedia();

    if (isLoading && data.length === 0) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color="#fff" />
                <Text className="text-white mt-4">Loading...</Text>
            </View>
        );
    }

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

export default ItemListing
