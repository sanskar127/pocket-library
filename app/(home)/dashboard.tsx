import useFetchMedia from '@/hooks/useFetchMedia';
import { DirectoryInterface, ImageInterface, RenderItemInterface, VideoInterface } from '@/types/types';
import Directory from '@/components/common/Directory';
import Image from '@/components/common/Image';
import Video from '@/components/common/Video';
import { FlatList, View, ActivityIndicator, Text, RefreshControl } from 'react-native';
export default function Dashboard() {
  const { data, isLoading, handleRefresh, updateOffset, isRefreshing, isError } = useFetchMedia();

  const renderItem: RenderItemInterface = ({ item }) => {
    if (item.type === 'directory') return <Directory details={item as DirectoryInterface} />
    if (item.type.startsWith('image/')) return <Image details={item as ImageInterface} />
    if (item.type.startsWith('video/')) return <Video details={item as VideoInterface} />

    return null;
  };

  return (
    <FlatList
            data={data}
            keyExtractor={(item: any) => item.id}
            renderItem={renderItem}
            onEndReached={updateOffset}
            onEndReachedThreshold={0.2}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                />
            }
            contentContainerStyle={{
                padding: 16,
                rowGap: 16,
            }}
            ListFooterComponent={
                isLoading ? (
                    <View className="py-4">
                        <ActivityIndicator size="small" color="#fff" />
                    </View>
                ) : (isError ? (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-white mt-4">Error to Fetch Data</Text>
                    </View>
                ) : null)
            }
        />
  )
}
