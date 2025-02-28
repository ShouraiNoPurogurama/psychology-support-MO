import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function SettingOptions() {
  const router = useRouter();

  const settings = [
    { name: "Profile Settings", route: "/doctor/profileSettings", icon: "person" },
    { name: "Notifications", route: "/doctor/notificationSettings", icon: "notifications" },
    { name: "Privacy & Security", route: "/doctor/securitySettings", icon: "lock" },
    { name: "About App", route: "/doctor/about", icon: "info" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.replace("/doctor/doctorHome")} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#AF93D2" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      {/* Settings List */}
      <View style={styles.settingsList}>
        {settings.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingItem}
            onPress={() => router.push(item.route)}
          >
            <View style={styles.iconTextContainer}>
              <MaterialIcons name={item.icon as any} size={24} color="#AF93D2" style={styles.icon} />
              <Text style={styles.settingText}>{item.name}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#AF93D2",
    marginLeft: 10,
  },
  settingsList: {
    marginTop: 10,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  settingText: {
    fontSize: 16,
    color: "#333",
  },
});


