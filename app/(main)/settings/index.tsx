import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import Switch from '@/components/ui/Switch'
import { useRouter } from 'expo-router'

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
  const router = useRouter()

  const settingsCategories: { title: string; data: SettingItem[] }[] = [
    {
      title: 'General',
      data: [
        {
          title: 'Change Origin',
          subtitle: 'Select your content origin',
          onPress: () => router.navigate('/'),
        },
        {
          title: 'Your Library',
          subtitle: 'Manage your media library',
          onPress: () => router.push('/settings/library'),
        },
        {
          title: 'Manage Search History',
          subtitle: 'Clear or manage search data',
          onPress: () => router.push('/settings/history'),
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
          title: 'Delete Cache',
          subtitle: 'Clear metadata only, Clear complete data',

          onPress: () => router.push('/settings/clearcache'),
        },
        {
          title: 'Manage App Lock',
          subtitle: 'Secure your app with a lock',

          onPress: () => router.push('/settings/lock'),
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