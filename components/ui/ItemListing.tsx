import { FlatList, View, ActivityIndicator } from 'react-native';
import { FC, useState } from 'react';
import { ItemListingPropsInterface, ItemType } from '@/types/types';
const items_max = 7

const ItemListing: FC<ItemListingPropsInterface> = ({ data, renderItem }) => {
    const [displayedItems, setDisplayedItems] = useState<ItemType[]>([])
    const [page, setPage] = useState<number>(1)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const keyExtractor = (item: any) => item.id;

    const handleEndReached = () => {
        setIsLoading(true)
        if (data && page * items_max < data.length) {
            const newItems = data.slice(0, (page + 1) * items_max);
            setDisplayedItems(newItems);
            setPage(page + 1); // Update the page for next load
            setIsLoading(false)
        }
    };

    return (
        <FlatList
            data={displayedItems}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.2}
            contentContainerStyle={{
                padding: 16,
                backgroundColor: '#1e1e1e',
                rowGap: 16,
            }}
            ListFooterComponent={
                isLoading ? (
                    <View className="py-4">
                        <ActivityIndicator size="small" color="#fff" />
                    </View>
                ) : null
            }
        />
    );
}

export default ItemListing
