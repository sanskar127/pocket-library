import Directory from '@/components/common/Directory';
import Image from '@/components/common/Image';
import Video from '@/components/common/Video';
import useFetchMedia from '@/hooks/useFetchMedia';
import useLocalRouter from '@/hooks/useLocalRouter';
import { DirectoryInterface, ImageInterface, VideoInterface } from '@/types/types';
import { ScrollView, Text, View, SafeAreaView, ActivityIndicator } from 'react-native';

export default function Dashboard() {
  const { data, isLoading } = useFetchMedia();
  useLocalRouter()

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
        <View className="w-full p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {data.map(item => {
            if (item.type === "directory") {
              return <Directory key={item.id} details={item as DirectoryInterface} />;
            }

            if (item.type.startsWith("image/")) {
              return <Image key={item.id} details={item as ImageInterface} />;
            }

            if (item.type.startsWith("video/")) {
              return <Video key={item.id} details={item as VideoInterface} />;
            }
          })}
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