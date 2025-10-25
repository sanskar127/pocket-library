import { Provider } from 'react-redux';
import { store } from '@/store/store';
import './global.css'
import LocalRouter from '@/components/common/LocalRouter';
import { Stack } from 'expo-router';
import Lockscreen from '@/components/common/Lockscreen';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Lockscreen>
        <LocalRouter>
          <Stack screenOptions={{ headerStyle: { backgroundColor: "#1e1e1e" }, headerTintColor: "#ffffff", contentStyle: { backgroundColor: "#1e1e1e" } }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="scanner"
              options={{
                title: 'Scanner',
              }}
            />
            <Stack.Screen name="(home)" options={{ headerShown: false }} />
            <Stack.Screen name="lock" options={{ headerShown: false }} />
          </Stack>
        </LocalRouter>
      </Lockscreen>
    </Provider>
  );
}
