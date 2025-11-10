import SearchButton from "@/components/common/SearchButton";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#1e1e1e',  // Dark background for tab bar
                    borderTopWidth: 2,           // Border on top for separation
                    borderTopColor: '#444',      // Lighter border for better contrast
                    paddingTop: 10,              // Increased padding for better alignment
                    paddingBottom: 10,           // Added padding for better spacing
                },
                headerStyle: {
                    backgroundColor: '#1e1e1e', // Match tab bar background color
                    elevation: 4,                // Subtle shadow for header
                },
                sceneStyle: { backgroundColor: '#000000' },
                headerTitle: 'Pocket Library', // Title in the header
                headerTitleStyle: {
                    color: '#fff',              // White text color for the title
                    fontSize: 20,                // A bit larger font size for the title
                    fontWeight: 'medium',          // Make the title bold
                },
                headerRight: () => (
                    <SearchButton color={"gray"} />
                ),
                tabBarShowLabel: false,           // Hide labels on tabs
                tabBarActiveTintColor: '#fff',   // White color for active tab icon
                tabBarInactiveTintColor: '#888', // Lighter color for inactive tab icon
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />
                }}
            />
            <Tabs.Screen
                name="feed"
                options={{
                    headerShown: false,
                    title: "Feed",
                    tabBarIcon: ({ color }) => <Ionicons name="image" size={28} color={color} />
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color }) => <Ionicons name="settings" size={28} color={color} />
                }}
            />

            <Tabs.Screen name="search" options={{ href: null }} />
            <Tabs.Screen name="watch" options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' } }} />
        </Tabs>
    )
}