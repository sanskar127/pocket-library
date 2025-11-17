import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native'

const SearchButton = () => {
    const router = useRouter();

    const handlePress = () => {
        router.navigate('/search');
    };
    return (
        <Pressable onPress={handlePress} android_ripple={{ color: '#888' }}>
            <Ionicons
                style={{marginRight: 14}}
                name="search-outline"
                size={28}
                color='white'
            />
        </Pressable>
    )
}

export default SearchButton
