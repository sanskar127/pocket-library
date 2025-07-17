import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';
import type { ItemType } from '../types/types';

interface ItemsContextType {
  items: ItemType[];
  setItems: Dispatch<SetStateAction<ItemType[]>>
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useVideos must be used within a VideoProvider');
  }
  return context;
};

export default ItemsContext;
