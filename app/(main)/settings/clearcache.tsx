import React from "react";
import { Alert, Pressable, Text, View, StyleSheet, Platform } from "react-native";

const ClearCacheScreen = () => {
  const handleClearCache = (type: "metadata" | "everything") => {
    Alert.alert(
      "Confirm",
      `Are you sure you want to clear ${type}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => console.log(`${type} cleared`) },
      ]
    );
  };

  const renderCardButton = (
    label: string,
    type: "metadata" | "everything",
    destructive = false
  ) => (
    <View style={[styles.card, destructive && styles.destructiveCard]}>
      <Pressable
        onPress={() => handleClearCache(type)}
        android_ripple={{ color: destructive ? "#550000" : "#333" }}
        style={({ pressed }) => pressed && { transform: [{ scale: 0.97 }] }}
      >
        <Text style={[styles.buttonText, destructive && styles.destructiveText]}>
          {label}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Delete Cache</Text>
        <Text style={styles.subHeader}>
          Erase metadata or full cache with thumbnails, streams
        </Text>
      </View>

      {/* Card Buttons */}
      <View style={styles.cardsContainer}>
        {renderCardButton("Metadata", "metadata")}
        {renderCardButton("Everything", "everything", true)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    backgroundColor: "#000000",
  },
  headerContainer: {
    marginBottom: 48,
  },
  header: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  subHeader: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 8,
  },
  cardsContainer: {
    flexDirection: "column",
  },
  card: {
    backgroundColor: "#1F1F1F",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16, // spacing between cards
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  destructiveCard: {
    backgroundColor: "#330000",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  destructiveText: {
    color: "#FF6666",
    fontWeight: "700",
  },
});

export default ClearCacheScreen;
