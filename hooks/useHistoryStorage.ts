import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the type for the history object
type HistoryState = { [key: string]: string };

const STORAGE_KEY = 'connection_history';

/**
 * A custom hook to manage a persisted history of connections using AsyncStorage.
 * It loads the history on mount and saves it on every change.
 * @returns {object} An object containing the history state, and functions to add/remove entries.
 * - history: The current history object.
 * - addHistoryEntry: A function to add a new entry to the history.
 * - removeHistoryEntry: A function to remove an entry from the history.
 * - loading: A boolean indicating if the initial history is being loaded.
 */
export const useHistoryStorage = () => {
  const [history, setHistory] = useState<HistoryState>({});
  const [loading, setLoading] = useState<boolean>(true);

  // useEffect #1: Load history from AsyncStorage on component mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedHistory !== null) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (e) {
        console.error("Failed to load history from AsyncStorage", e);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []); // Empty dependency array ensures this runs only once

  // useEffect #2: Save history to AsyncStorage whenever the state changes
  useEffect(() => {
    // Only save if history is not empty and loading is done
    if (!loading) {
      const saveHistory = async () => {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (e) {
          console.error("Failed to save history to AsyncStorage", e);
        }
      };
      saveHistory();
    }
  }, [history, loading]); // This effect runs whenever 'history' or 'loading' changes

  // Public functions to modify the history state
  const addHistoryEntry = (url: string) => {
    setHistory(prev => ({ ...prev, [url]: url }));
  };

  const removeHistoryEntry = (entry: string) => {
    setHistory(prev => {
      const newHistory = { ...prev };
      delete newHistory[entry];
      return newHistory;
    });
  };

  return { history, addHistoryEntry, removeHistoryEntry, loading };
};