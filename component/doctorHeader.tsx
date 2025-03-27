import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import { LinearGradient } from "expo-linear-gradient";

export const DoctorHeader: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("No token found");

        const decoded: any = jwtDecode(token);
        const userId = decoded.userId;

        const response = await fetch(
          `https://psychologysupport-image.azurewebsites.net/image/get?ownerType=User&ownerId=${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch avatar URL");
        }

        const data = await response.json();
        setAvatarUrl(data.url);
      } catch (error) {
        console.error("Error fetching avatar:", error);
        setAvatarUrl(null);
      }
    };

    fetchAvatar();
  }, []);

  return (
    <View>
    <LinearGradient
      colors={["#4B0082", "#8A2BE2"]} // Gradient từ xanh navy (#4B0082) sang tím (#8A2BE2)
      style={[styles.headerContainer, { width: "100%" }]} // Đảm bảo gradient bao phủ toàn bộ chiều rộng
    >
      <TouchableOpacity
        onPress={() => router.push("/doctors/other/doctorNotifications")}
        style={styles.leftContainer}
      >
        <MaterialIcons name="notifications" size={24} color="white" />
        <Text style={styles.appName}>EmoEase</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/doctors/profiles/doctorProfile",
          })
        }
      >
        {avatarUrl ? (
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="cover" />
          </View>
        ) : (
          <View style={styles.avatarPlaceholder}>
            <MaterialIcons name="person" size={30} color="#6A8CAF" />
          </View>
        )}
      </TouchableOpacity>
    </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%", // Đảm bảo header chiếm toàn bộ chiều rộng
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
  avatarContainer: {
    width: 50,
    height: 50, // Keep the avatar container circular
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000", // Add shadow for depth
    elevation: 5, // Shadow for Android
  },
  avatar: {
    width: 50,
    height: 75, // Increase height to show only the top part of the image
    borderRadius: 25, // Circular shape
    position: "absolute", // Ensure the image stays within the container
    top: -10, // Shift the image upward to show the top part
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF5E1", // Light background for placeholder
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700", // Gold border for placeholder
  },
});










