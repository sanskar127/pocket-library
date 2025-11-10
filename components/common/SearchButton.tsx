import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';
import React, { FC } from 'react'
import { Pressable } from 'react-native'

const SearchButton: FC<{ color: string | undefined }> = ({ color }) => {
    const router = useRouter();

    const handlePress = () => {
        router.navigate('/search');
    };
    return (
        <Pressable onPress={handlePress} android_ripple={{ color: '#888' }}>
            <Ionicons
                style={{marginRight: 14}}
                name="search"
                size={28}
                color={color}
            />
        </Pressable>
    )
}

export default SearchButton
