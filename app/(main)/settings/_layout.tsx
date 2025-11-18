import SearchButton from "@/components/common/SearchButton";
import { Stack } from "expo-router";

export default function SettingsStack() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#000000" },
        contentStyle: { backgroundColor: '#000000' },
        headerTintColor: "#ffffff", 
      }}
    >
      {/* Index screen: show Tabs-style header */}
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Pocket Library",
          headerStyle: { backgroundColor: "#000000" },
          headerTitleStyle: { color: "#ffffff", fontSize: 20 },
          headerRight: () => <SearchButton />,
        }}
      />

      <Stack.Screen name="library" options={{ headerTitle: "Library" }} />
      <Stack.Screen name="history" options={{ headerTitle: "Manage Search History" }} />
      <Stack.Screen name="clearcache" options={{ headerTitle: "" }} />
      <Stack.Screen name="lock" options={{ headerTitle: "" }} />
    </Stack>
  );
}
