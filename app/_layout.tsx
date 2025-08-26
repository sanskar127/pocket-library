import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
// import Header from '@/component/Header';
import './global.css'

export default function RootLayout() {

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}


{/* <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="/dashboard/*" options={{ header: () => <Header title="Dashboard" /> }} />
      </Stack> */}