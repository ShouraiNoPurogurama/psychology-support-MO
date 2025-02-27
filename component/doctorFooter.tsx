import { TouchableOpacity, View, StyleSheet } from "react-native";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { router, usePathname } from "expo-router";

export const Footer: React.FC = () => {
    const pathname = usePathname();
    console.log('Current pathname:', pathname); // Debugging line

    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity
                onPress={() => {
                    if (pathname !== "/doctor/doctorHome") {
                        console.log('Navigating to /doctor/doctorHome'); // Debugging line
                        router.push("/doctor/doctorHome");
                    }
                }}
                style={styles.button}
                disabled={pathname === "/doctor/doctorHome"}
                accessibilityLabel="Home"
            >
                <MaterialIcons name="home" size={30} color={pathname === "/doctor/doctorHome" ? "black" : "white"} />
            </TouchableOpacity>
            
            <TouchableOpacity 
                onPress={() => {
                    if (pathname !== "/doctor/chatList") {
                        console.log('Navigating to /doctor/chatList'); // Debugging line
                        router.push("/doctor/chatList");
                    }
                }} 
                style={styles.button}
                accessibilityLabel="Chat"
            >
                <MaterialIcons name="chat" size={30} color={pathname === "/doctor/chatList" ? "black" : "white"} />
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
        backgroundColor: "#AF93D2",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: "black",
    },
    button: {
        paddingVertical: 8,
    },
});
