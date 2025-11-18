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
    disabled?: boolean
  }
  | {
    title: string
    subtitle: string
    isSwitch: true
    value: boolean
    disabled?: boolean
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
          disabled: true
        },
        {
          title: 'Manage Search History',
          subtitle: 'Clear or manage search data',
          onPress: () => router.push('/settings/history'),
          disabled: true
        },
      ],
    },
    {
      title: 'Security & Maintenance',
      data: [
        {
          title: 'Delete Cache',
          subtitle: 'Delete metadata, Delete everything',

          onPress: () => router.push('/settings/clearcache'),
        },
        {
          title: 'Manage App Lock',
          subtitle: 'Secure your app with a lock',

          onPress: () => router.push('/settings/lock'),
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
          disabled: true,
          onValueChange: () => setOffline(prev => !prev),
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
                  onPress={!isSwitchItem(item) && !item.disabled ? item.onPress : undefined}
                  activeOpacity={item.disabled ? 1 : 0.7}
                  disabled={item.disabled}
                  className="flex-row justify-between items-center p-4 rounded-lg"
                >
                  <View className="flex-1">
                    <Text
                      className={`font-medium ${item.disabled ? 'text-gray-600' : 'text-white'}`}
                    >
                      {item.title}
                    </Text>
                    <Text
                      className={`text-sm ${item.disabled ? 'text-gray-600' : 'text-gray-400'}`}
                    >
                      {item.subtitle}
                    </Text>
                  </View>

                  {isSwitchItem(item) ? (
                    <Switch value={item.value} disabled={item.disabled} onValueChange={item.onValueChange} />
                  ) : (
                     !item.disabled && <Ionicons
                      name="chevron-forward"
                      size={20}
                      color='white'
                    />
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