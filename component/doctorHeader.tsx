import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export const DoctorHeader: React.FC<{ avatarUrl?: string }> = ({ avatarUrl }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Góc trái: Thông báo & Tên ứng dụng */}
      <TouchableOpacity onPress={() => router.push("/doctor/notifications")} style={styles.leftContainer}>
        <MaterialIcons name="notifications" size={24} color="white" />
        <Text style={styles.appName}>EmoEase</Text>
      </TouchableOpacity>

      {/* Góc phải: Avatar bác sĩ */}
      <TouchableOpacity onPress={() => router.push("/doctor/profile")}>
        <Image
          source={{ uri: avatarUrl || "https://bizweb.dktcdn.net/100/175/849/files/chup-anh-profile-cho-bac-si-tai-ha-noi-studio-yeu-media-dep-01.jpg?v=1636203347577" }} 
          style={styles.avatar}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#AF93D2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "black",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  appName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
