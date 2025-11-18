import { FC, ReactNode, RefObject, useCallback, useRef, useState, useEffect } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Text, View, TouchableOpacity, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Switch from "./Switch";
import { filterInterface } from "@/types/types";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "@/store/store";
import { setFilter } from "@/features/filterSlice";

interface props {
    children: ReactNode
    ref: RefObject<BottomSheetModal | null>
}

const FILTER_KEY = "filter";

const typeOptions = [
    { id: 0, title: "Name", value: "name" },
    { id: 1, title: "Date", value: "date" },
    { id: 2, title: "Size", value: "size" },
] as const;

const orderOptions = [
    { id: 0, title: "Ascending", value: "ascending" },
    { id: 1, title: "Descending", value: "descending" },
] as const;

const FilterBottomSheet: FC<props> = ({ children, ref }) => {
    const dispatch = useDispatch();
    const globalFilter = useSelector((state: RootState) => state.filter.filter);
    const loading = useSelector((state: RootState) => state.filter.loading);

    const typeSheetRef = useRef<BottomSheetModal>(null);
    const orderSheetRef = useRef<BottomSheetModal>(null);

    // 🔥 Local filter state
    const [localFilter, setLocalFilter] = useState<filterInterface | null>(null);

    // 🟦 Load global filter into local filter when sheet opens
    useEffect(() => {
        if (globalFilter) setLocalFilter(globalFilter);
    }, [globalFilter, ref]); // ensures refresh each open

    const submitChanges = useCallback(async () => {
        if (!localFilter) return;

        try {
            await AsyncStorage.setItem(FILTER_KEY, JSON.stringify(localFilter));
            dispatch(setFilter(localFilter));
            ref.current?.close();
        } catch (err) {
            console.error("Failed saving filter:", err);
        }
    }, [localFilter, dispatch, ref]);

    const updateLocalFilter = (update: Partial<filterInterface>) => {
        setLocalFilter(prev => ({ ...(prev as filterInterface), ...update }));
    };

    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                {children}

                {/* Main Bottom Sheet */}
                <BottomSheetModal
                    ref={ref}
                    snapPoints={["30%"]}
                    backgroundStyle={{ backgroundColor: "black" }}
                    handleIndicatorStyle={{ backgroundColor: "white" }}
                    enablePanDownToClose
                >
                    {
                        loading || !localFilter ? (
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <ActivityIndicator size="large" color="white" />
                            </View>
                        ) : (
                            <BottomSheetView className="p-4">

                                <Text className="text-gray-400 font-semibold mb-2">Apply Filter</Text>

                                <View className="space-y-4">

                                    {/* Type */}
                                    <TouchableOpacity
                                        onPress={() => typeSheetRef.current?.present()}
                                        className="flex-row justify-between items-center p-4 rounded-lg"
                                    >
                                        <Text className="text-white font-medium">Type</Text>
                                        <Text className="text-white/60">
                                            {localFilter.type.charAt(0).toUpperCase() + localFilter.type.slice(1)}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Order */}
                                    <TouchableOpacity
                                        onPress={() => orderSheetRef.current?.present()}
                                        className="flex-row justify-between items-center p-4 rounded-lg"
                                    >
                                        <Text className="text-white font-medium">Order</Text>
                                        <Text className="text-white/60">
                                            {localFilter.order.charAt(0).toUpperCase() + localFilter.order.slice(1)}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Directory First */}
                                    <View className="flex-row justify-between items-center p-4 rounded-lg">
                                        <Text className="text-white font-medium">Sort Directories First</Text>

                                        <Switch
                                            value={localFilter.sortDirectoryFirst}
                                            onValueChange={value => updateLocalFilter({ sortDirectoryFirst: value })}
                                        />
                                    </View>

                                </View>

                                <Pressable onPress={submitChanges} className="bg-white p-3 rounded-md mt-4">
                                    <Text className="text-center text-black text-lg font-semibold">Done</Text>
                                </Pressable>

                            </BottomSheetView>
                        )
                    }
                </BottomSheetModal>

                {/* Type Sheet */}
                <BottomSheetModal
                    ref={typeSheetRef}
                    snapPoints={["30%"]}
                    backgroundStyle={{ backgroundColor: "black" }}
                    handleIndicatorStyle={{ backgroundColor: "white" }}
                >
                    {
                        loading || !localFilter ? (
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <ActivityIndicator size="large" color="white" />
                            </View>
                        ) : (
                            <BottomSheetView className="p-4">
                                {typeOptions.map(item => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => {
                                            updateLocalFilter({ type: item.value });
                                            typeSheetRef.current?.close();
                                        }}
                                        className="flex-row justify-between p-4"
                                    >
                                        <Text className="text-white">{item.title}</Text>
                                        {localFilter.type === item.value && (
                                            <Ionicons name="checkmark" size={20} color="white" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </BottomSheetView>
                        )
                    }
                </BottomSheetModal>

                {/* Order Sheet */}
                <BottomSheetModal
                    ref={orderSheetRef}
                    snapPoints={["30%"]}
                    backgroundStyle={{ backgroundColor: "black" }}
                    handleIndicatorStyle={{ backgroundColor: "white" }}
                >
                    {
                        loading || !localFilter ? (
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <ActivityIndicator size="large" color="white" />
                            </View>
                        ) : (
                            <BottomSheetView className="p-4">
                                {orderOptions.map(item => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => {
                                            updateLocalFilter({ order: item.value });
                                            orderSheetRef.current?.close();
                                        }}
                                        className="flex-row justify-between p-4"
                                    >
                                        <Text className="text-white">{item.title}</Text>
                                        {localFilter.order === item.value && (
                                            <Ionicons name="checkmark" size={20} color="white" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </BottomSheetView>
                        )
                    }
                </BottomSheetModal>

            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

export default FilterBottomSheet;
