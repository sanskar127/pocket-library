import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import './global.css'
import LocalRouter from '@/components/common/LocalRouter';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <LocalRouter>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="scanner"
            options={{
              title: 'Scanner',
              headerStyle: {
                backgroundColor: '#1e1e1e',
              },
              headerTintColor: '#fff', // optional: sets text/icons color to white
            }}
          />
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
        </Stack>
      </LocalRouter>
    </Provider>
  );
}
