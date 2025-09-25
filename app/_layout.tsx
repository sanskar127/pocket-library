import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import './global.css'
import Header from '@/components/common/Header';

export default function RootLayout() {

  return (
    <Provider store={store}>
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
        <Stack.Screen name="dashboard" options={{ header: () => <Header title="Dashboard" /> }} />
        <Stack.Screen name='watch/[id]' options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
