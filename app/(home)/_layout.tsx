import { Stack } from 'expo-router';
import Header from '@/components/common/Header';
import useFetchMedia from '@/hooks/useFetchMedia';
import { ActivityIndicator, Text, View } from 'react-native';

export default function RootLayout() {
    const { isLoading, isError } = useFetchMedia();

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color="#fff" />
                <Text className="text-white mt-4">Loading...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <Text className="text-white mt-4">Error to Fetch Data</Text>
            </View>
        );
    }
    
    return (
        <Stack>
            <Stack.Screen name="dashboard" options={{ header: () => <Header title="Dashboard" /> }} />
            <Stack.Screen name='watch/[id]' options={{ headerShown: false }} />
        </Stack>
    );
}
