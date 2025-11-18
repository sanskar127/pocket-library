import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setIsEnableDirect } from '@/features/lockSlice';
import Switch from '@/components/ui/Switch';
import { Ionicons } from '@expo/vector-icons';

const LockSettingScreen = () => {
  const [toggleLock, setToggleLock] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLockState = async () => {
      try {
        const value = await AsyncStorage.getItem('isEnable');
        setToggleLock(value === 'true');
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };

    fetchLockState();
  }, []);

  const handleToggle = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('isEnable', value ? 'true' : 'false');
      dispatch(setIsEnableDirect(value));
      setToggleLock(value);
    } catch (e) {
      console.error('Failed to save data', e);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#000000', // pure black
    },
    sectionHeader: {
      fontSize: 20,
      fontWeight: '600',
      color: '#FFFFFF', // white font
      marginBottom: 12,
    },
    card: {
      backgroundColor: '#1A1A1A', // dark gray for card contrast
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 3,
    },
    cardHeader: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      marginBottom: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardDescription: {
      fontSize: 14,
      color: '#CCCCCC', // slightly lighter than white
      marginBottom: 12,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    switchLabel: {
      fontSize: 15,
      color: '#FFFFFF',
      fontWeight: '500',
      flex: 1,
      marginRight: 12,
    },
    lockIcon: {
      marginRight: 6,
      color: 'white', // gold lock icon
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionHeader}>App Lock</Text>

      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Ionicons name="lock-closed-outline" size={20} style={styles.lockIcon} />
          <Text style={styles.cardHeader}>Enable App Lock</Text>
        </View>
        <Text style={styles.cardDescription}>
          Protect your apps with a passcode. Only authorized users can access them.
        </Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Toggle to Enable/Disable</Text>
          <Switch value={toggleLock} onValueChange={handleToggle} />
        </View>
      </View>
    </ScrollView>
  );
};

export default LockSettingScreen;
