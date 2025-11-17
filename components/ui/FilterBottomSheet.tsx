import { FC, ReactNode, RefObject, useCallback, useRef, useState } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { Text, View, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Switch from "./Switch";
import { filterInterface } from "@/types/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setFilter } from "@/features/filterSlice";

interface props {
    children: ReactNode
    ref: RefObject<BottomSheetModal | null>
}

const FILTER_KEY = 'filter'

const typeOptions: { id: number, title: string, value: 'name' | 'date' | 'size' }[] = [
    {
        id: 0,
        title: "Name",
        value: "name"
    },
    {
        id: 1,
        title: "Date",
        value: "date"
    },
    {
        id: 2,
        title: "Size",
        value: "size"
    },
]

const orderOptions: { id: number, title: string, value: 'ascending' | 'descending' }[] = [
    {
        id: 0,
        title: "Ascending",
        value: "ascending"
    },
    {
        id: 1,
        title: "Descending",
        value: "descending"
    }
]

const FilterBottomSheet: FC<props> = ({ children, ref }) => {
    const filter = useSelector((state: RootState) => state.filter)
    const [newFilter, setNewFilter] = useState<filterInterface>(filter);
    const dispatch = useDispatch()
    // const snapPoints = useMemo(() => ['30%'], [])
    const typeSheetRef = useRef<BottomSheetModal>(null);
    const orderSheetRef = useRef<BottomSheetModal>(null);

    // const handlePresentFilterSheet = useCallback(() => {
    //     filterSheetRef.current?.present();
    // }, []);

    // const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const submitFilterChanges = useCallback(async () => {
        try {
            dispatch(setFilter(newFilter))
            await AsyncStorage.setItem(FILTER_KEY, JSON.stringify(filter))
            ref.current?.close()
        } catch (err) {
            console.error('Failed to write filter in Async Storage:', err)
        }
    }, [dispatch, filter, newFilter, ref])

    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                {children}

                {/* Filter Bottom Sheet */}
                <BottomSheetModal
                    ref={ref}
                    snapPoints={["30%"]}
                    backgroundStyle={{ backgroundColor: 'black' }}
                    handleIndicatorStyle={{
                        backgroundColor: 'white',
                    }}
                    enablePanDownToClose
                >
                    <BottomSheetView className='p-4'>
                        <Text className="text-gray-400 font-semibold mb-2">Apply Filter</Text>

                        <View className='space-y-4'>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => typeSheetRef.current?.present()}
                                className="flex-row justify-between items-center p-4 rounded-lg"
                            >
                                <Text className="text-white font-medium text-base">Type</Text>

                                <View className="flex-row items-center gap-2">
                                    <Text className="text-white/60 text-sm">{newFilter.type.charAt(0).toUpperCase() + newFilter.type.slice(1)}</Text>
                                    <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => orderSheetRef.current?.present}
                                className="flex-row justify-between items-center p-4 rounded-lg"
                            >
                                <Text className="text-white font-medium text-base">Order</Text>

                                <View className="flex-row items-center gap-2">
                                    <Text className="text-white/60 text-sm">{newFilter.order.charAt(0).toUpperCase() + newFilter.order.slice(1)}</Text>
                                    <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
                                </View>
                            </TouchableOpacity>

                            <View className="flex-row justify-between items-center p-4 rounded-lg">
                                <Text className="text-white font-medium">Sort Directories First</Text>

                                <Switch
                                    value={newFilter.sortDirectoryFirst}
                                    onValueChange={(value) => setNewFilter({
                                        ...newFilter,
                                        sortDirectoryFirst: value, // Ensure this is set
                                    })}
                                />
                            </View>
                        </View>

                        <Pressable onPress={submitFilterChanges} className='bg-white rounded-md p-3'>
                            <Text className='text-center text-black text-lg font-semibold'>done</Text>
                        </Pressable>
                    </BottomSheetView>
                </BottomSheetModal>

                {/* Type Bottom Sheet */}
                <BottomSheetModal
                    ref={typeSheetRef}
                    snapPoints={["30%"]}
                    backgroundStyle={{ backgroundColor: 'black' }}
                    handleIndicatorStyle={{
                        backgroundColor: 'white',
                    }}
                >
                    <BottomSheetView className='p-4'>
                        <Text className="text-gray-400 font-semibold mb-2">Type</Text>

                        <View className='space-y-4'>
                            {typeOptions.map(item => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => {
                                        setNewFilter(prev => ({ ...prev, type: item.value }))
                                        typeSheetRef.current?.close()
                                    }}
                                    activeOpacity={0.7}
                                    className="flex-row justify-between items-center p-4 rounded-lg"
                                >
                                    <Text className="text-white font-medium text-base">{item.title}</Text>

                                    {newFilter.type === item.value && <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </BottomSheetView>
                </BottomSheetModal>

                {/* Type Bottom Sheet */}
                <BottomSheetModal
                    ref={orderSheetRef}
                    snapPoints={["30%"]}
                    backgroundStyle={{ backgroundColor: 'black' }}
                    handleIndicatorStyle={{
                        backgroundColor: 'white',
                    }}
                >
                    <BottomSheetView className='p-4'>
                        <Text className="text-gray-400 font-semibold mb-2">Order</Text>

                        <View className='space-y-4'>
                            {orderOptions.map(item => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => {
                                        setNewFilter(prev => ({ ...prev, order: item.value }))
                                        orderSheetRef.current?.close()
                                    }}
                                    activeOpacity={0.7}
                                    className="flex-row justify-between items-center p-4 rounded-lg"
                                >
                                    <Text className="text-white font-medium text-base">{item.title}</Text>

                                    {newFilter.order === item.value && <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </BottomSheetView>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}

export default FilterBottomSheet
