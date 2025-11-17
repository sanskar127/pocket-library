import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import Switch from '@/components/ui/Switch'

type SettingItem =
  | {
    title: string
    subtitle: string
    onPress: () => void
  }
  | {
    title: string
    subtitle: string
    isSwitch: true
    value: boolean
    onValueChange: () => void
  }

// Type guard to help TypeScript distinguish switch items
const isSwitchItem = (item: SettingItem): item is Extract<SettingItem, { isSwitch: true }> => 'isSwitch' in item

const Index = () => {
  const [offline, setOffline] = useState(false)  // Temp Toggle placeholder, Feature implments in future

  const settingsCategories: { title: string; data: SettingItem[] }[] = [
    {
      title: 'General',
      data: [
        {
          title: 'Change Origin',
          subtitle: 'Select your content origin',
          onPress: () => console.log('Navigate to Change Origin'),
        },
        {
          title: 'Your Library',
          subtitle: 'Manage your media library',
          onPress: () => console.log('Navigate to Library'),
        },
        {
          title: 'Manage Search History',
          subtitle: 'Clear or manage search data',
          onPress: () => console.log('Navigate to Search History'),
        },
      ],
    },
    {
      title: 'Offline',
      data: [
        {
          title: 'Go Offline',
          subtitle: 'Enable offline mode',
          isSwitch: true,
          value: offline,
          onValueChange: () => setOffline(prev => !prev),
        },
      ],
    },
    {
      title: 'Security & Maintenance',
      data: [
        {
          title: 'Refresh Backend Feed',
          subtitle: 'Clear cached feed and fetch latest data',

          onPress: () => console.log('Navigate to Refresh Backend Feed'),
        },
        {
          title: 'Manage App Lock',
          subtitle: 'Secure your app with a lock',

          onPress: () => console.log('Navigate to App Lock'),
        },
      ],
    },
  ]

  return (
    <ScrollView className="p-4 bg-black">
      <Text className="text-3xl font-medium text-white mb-4">Settings</Text>

      <View className="space-y-6">
        {settingsCategories.map((category, catIndex) => (
          <View key={catIndex}>
            <Text className="text-gray-400 font-semibold mb-2">{category.title}</Text>

            <View className="space-y-4">
              {category.data.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={!isSwitchItem(item) ? item.onPress : undefined}
                  activeOpacity={isSwitchItem(item) ? 1 : 0.7}
                  className="flex-row justify-between items-center p-4 rounded-lg"
                >
                  <View className="flex-1">
                    <Text className="text-white font-medium">{item.title}</Text>
                    <Text className="text-gray-400 text-sm">{item.subtitle}</Text>
                  </View>

                  {isSwitchItem(item) ? (
                    <Switch value={item.value} onValueChange={item.onValueChange} />
                  ) : (
                    <Ionicons name='chevron-forward' size={20} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default Index

{/* Change Origin - Origin Screen */ }
{/* Go Offline - Toggle */ }
{/* Your Library - Library Screen */ }
{/* Search History - search history page */ }
{/* Refresh Backend Cache - Dialog */ }
{/* Manage App Lock - Lock Setting Page */ }