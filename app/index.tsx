import { Ionicons } from "@expo/vector-icons";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Welcome () {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 items-center justify-center px-4 bg-background">
          <Text className="text-white text-6xl font-bold text-center mb-12">
            Welcome
          </Text>

          <View className="w-full max-w-md gap-4">
            <Text className="text-white text-lg mb-1">
              Enter Pocket Server IP Address:
            </Text>

            <View className="flex-row items-center bg-white/10 border border-white/20 rounded-lg px-4">
              <TextInput
                placeholder="e.g. http://192.168.0.1:3000"
                placeholderTextColor="#A0A0A0"
                className="flex-1 py-4 pr-4 text-white text-base"
              />
              <TouchableOpacity className="pl-2">
                <Ionicons name="arrow-forward-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
