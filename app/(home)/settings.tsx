import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Switch, useColorScheme, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setIsEnableDirect } from '@/features/lockSlice';
import { RootState } from '@/store/store';

const SettingsScreen = () => {
  const [toggleLock, setToggleLock] = useState<boolean>(false);
  // const isAvailable = useSelector((state: RootState) => state.lock.isAvailable);
  const dispatch = useDispatch();
  const colorScheme = useColorScheme(); // Detects whether the system is in dark or light mode

  // Fetch initial value from AsyncStorage on component mount
  useEffect(() => {
    const fetchLockState = async () => {
      try {
        const value = await AsyncStorage.getItem('isEnable');
        if (value === 'true') {
          setToggleLock(true);
        } else {
          setToggleLock(false);
        }
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };

    fetchLockState();
  }, []);

  // Handle toggle switch action
  const handleToggle = async (value: boolean) => {
    try {
      if (value) {
        await AsyncStorage.setItem('isEnable', 'true');
      } else {
        await AsyncStorage.setItem('isEnable', 'false');
      }
      
      // Dispatch the change to Redux store
      dispatch(setIsEnableDirect(value));
    } catch (e) {
      console.error('Failed to save data', e);
    }
    
    setToggleLock(value); // Update local state
  };

  // Define the dynamic styles based on the color scheme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#FFFFFF', // Dark mode background or light mode background
      padding: 16,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#FFFFFF' : '#000000', // Adjust text color for dark mode
      marginBottom: 16,
    },
    description: {
      fontSize: 16,
      color: colorScheme === 'dark' ? '#B0B0B0' : '#555555', // Lighter text color for dark mode
      marginBottom: 8,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    switchLabel: {
      fontSize: 16,
      color: colorScheme === 'dark' ? '#FFFFFF' : '#000000', // Adjust text color for dark mode
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Security Settings</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Toggle to Enable/Disable App Lock</Text>
        <Switch
          value={toggleLock}
          // disabled={isAvailable}
          onValueChange={handleToggle}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={toggleLock ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
