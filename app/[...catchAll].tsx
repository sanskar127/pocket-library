import Directory from '@/components/common/Directory';
import useFetchMedia from '@/hooks/useFetchMedia';
import { ResponseInterface } from '@/types/types';
import { usePathname } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function Dashboard() {
  const pathname = usePathname();
  const { data }: { data?: ResponseInterface } = useFetchMedia();

  useEffect(() => {
    if (data?.media) {
      console.log(data.media);
    }
  }, [data]);

  if (!pathname.startsWith('/dashboard')) {
    return (
      <View>
        <Text>404 Not Found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-background p-4">
      <View className="w-full max-w-2xl mx-auto">
        {data?.media?.map((item) => (
          item.type === 'directory' ? (
            <Directory key={item.id} details={item} />
          ) : (
            <View key={item.id} className="bg-white/10 p-4 my-2 rounded-lg w-full">
              <Text className="text-white text-lg">{item.name}</Text>
            </View>
          )
        ))}
      </View>
    </ScrollView>
  );
}
