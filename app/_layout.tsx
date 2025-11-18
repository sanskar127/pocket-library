import { Provider } from 'react-redux';
import { store } from '@/store/store';
import './global.css'
import LocalRouter from '@/components/common/LocalRouter';
import { Stack } from 'expo-router';
import Lockscreen from '@/components/common/Lockscreen';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Lockscreen>
        <LocalRouter>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerStyle: { backgroundColor: "black" }, headerTintColor: "#ffffff", contentStyle: { backgroundColor: "#000000" } }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="scanner"
              options={{
                title: 'Scanner',
              }}
            />
            <Stack.Screen name="(main)" options={{ headerShown: false }} />
          </Stack>
        </LocalRouter>
      </Lockscreen>
    </Provider>
  );
}
