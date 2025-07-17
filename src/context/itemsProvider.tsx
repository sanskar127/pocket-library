import { useState } from "react";
import type { FC, ReactNode } from "react";
import type { ItemType } from "../types/types";
import ItemsContext from './itemsContext';

export const ItemProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<ItemType[]>([]);

    return (
        <ItemsContext.Provider value={{ items, setItems }}>
            {children}
        </ItemsContext.Provider>
    );
};
