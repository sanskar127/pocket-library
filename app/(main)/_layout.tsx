import SearchButton from "@/components/common/SearchButton";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#000000',  // Dark background for tab bar
                    borderTopColor: '#444',      // Lighter border for better contrast
                    paddingTop: 3,              // Increased padding for better alignment
                    paddingBottom: 3,           // Added padding for better spacing
                },
                headerStyle: {
                    backgroundColor: '#000000', // Match tab bar background color
                    // elevation: 4,                // Subtle shadow for header
                },
                sceneStyle: { backgroundColor: '#000000' },
                headerTitle: 'Pocket Library', // Title in the header
                headerTitleStyle: {
                    color: '#fff',              // White text color for the title
                    fontSize: 20,                // A bit larger font size for the title
                    fontWeight: 'medium',          // Make the title bold
                },
                headerRight: () => <SearchButton />,
                tabBarShowLabel: false,           // Hide labels on tabs
                tabBarActiveTintColor: '#fff',   // White color for active tab icon
                tabBarInactiveTintColor: '#888', // Lighter color for inactive tab icon
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />
                }}
            />
            <Tabs.Screen
                name="feed"
                options={{
                    headerShown: false,
                    title: "Feed",
                    tabBarIcon: ({ color }) => <Ionicons name="image-outline" size={22} color={color} />
                }}
            />
            <Tabs.Screen
                name="downloads"
                options={{
                    title: "Downloads",
                    tabBarIcon: ({ color }) => <Ionicons name="cloud-download-outline" size={22} color={color} />
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={22} color={color} />
                }}
            />

            <Tabs.Screen name="search" options={{ href: null }} />
            <Tabs.Screen name="watch" options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' } }} />
        </Tabs>
    )
}