import Directory from '@/components/common/Directory';
import useFetchMedia from '@/hooks/useFetchMedia';
import useLocalRouter from '@/hooks/useLocalRouter';
import { ScrollView, Text, View, SafeAreaView, ActivityIndicator } from 'react-native';

export default function Dashboard() {
  const { data, isLoading, isError } = useFetchMedia();
  const [pathname, currentPath, setPathname, back] = useLocalRouter();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className='py-2'>
        <View className="w-full flex-col gap-4">
          {data?.map((item) =>
            item.type === 'directory' ? (
              <Directory key={item.id} details={item} />
            ) : (
              <View
                key={item.id}
                className="bg-white/10 p-4 rounded-lg w-full"
              >
                <Text className="text-white text-lg">{item.name}</Text>
              </View>
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


// {/* <Text className='text-white font-bold text-xl'>Complete Path: {pathname} </Text>
//         <Text className='text-white font-bold text-xl'>Current Path: {currentPath} </Text>
//         <TextInput value={input} onChangeText={setInput} className='bg-white/10 text-white border border-white/20 rounded-sm text-lg px-4 py-2 outline-none' placeholder='Input Path' />
//         <LocalLink to={input} className='bg-blue-400 text-lg px-4 py-2 font-bold text-white'>Add Path</LocalLink>
//         <Button title='Go Back' onPress={() => back()} /> */}