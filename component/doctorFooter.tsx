import { TouchableOpacity, View, StyleSheet, Image, Text } from "react-native";
import React, { useState, useEffect } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRouter, usePathname } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";

export const Footer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        onPress={() => {
          if (pathname !== "/doctors/doctorHome") {
            router.push("/doctors/doctorHome");
          }
        }}
        style={styles.button}
        disabled={pathname === "/doctors/doctorHome"}
        accessibilityLabel="Home"
      >
        <MaterialIcons name="home" size={30} color={pathname === "/doctors/doctorHome" ? "black" : "white"} />
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => {
          if (pathname !== "/doctors/other/chatList") {
            router.push("/doctors/other/chatList");
          }
        }}
        style={styles.button}
        accessibilityLabel="Chat"
      >
        <MaterialIcons name="chat" size={30} color={pathname === "/doctors/other/chatList" ? "black" : "white"} />
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => {
          if (pathname !== "/doctors/other/settingOptions") {
            router.push("/doctors/other/settingOptions");
          }
        }}
        style={styles.button}
        accessibilityLabel="Settings"
      >
        <MaterialIcons name="settings" size={30} color={pathname === "/doctors/other/settingOptions" ? "black" : "white"} />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
    footerContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 10,
        backgroundColor: "#AF93D2", // Đổi lại màu đơn sắc cũ
        borderTopWidth: 1,
        borderColor: "black",
    },
    button: {
        paddingVertical: 8,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: "black",
    },
    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    appName: {
        color: "white",
        fontSize: 20,
        marginLeft: 10,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: "hidden",
    },
    avatar: {
        width: "100%",
        height: "100%",
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
});
