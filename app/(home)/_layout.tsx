import SettingsButton from '@/components/common/SettingsButton';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function RootLayout() {
    
    return (
        <Stack screenOptions={{ headerStyle: { backgroundColor: "#121212" }, headerTintColor: "#ffffff", contentStyle: {backgroundColor: "#1e1e1e"} }}>
            <Stack.Screen name="dashboard" options={{ 
                title: 'Dashboard',
                headerLeft: () => <View />,
                headerRight: () => <SettingsButton />
             }} />
            <Stack.Screen name='watch/[id]' options={{ headerShown: false }} />
            <Stack.Screen name='view/[id]' options={{ 
                title: 'Image Viewer'
             }} />
        </Stack>
    );
}
