import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';
import React from 'react'
import { Pressable } from 'react-native'

const SettingsButton = () => {
    const router = useRouter();

    const handlePress = () => {
        router.navigate('/settings');
    };
    return (
        <Pressable onPress={handlePress} android_ripple={{ color: '#888' }}>
            <Ionicons
                name="settings-sharp"
                size={24}
                color="#fff"
            />
        </Pressable>
    )
}

export default SettingsButton
