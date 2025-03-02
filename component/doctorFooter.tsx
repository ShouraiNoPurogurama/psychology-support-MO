import { TouchableOpacity, View, StyleSheet } from "react-native";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRouter, usePathname } from "expo-router";

export const Footer: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    console.log('Current pathname:', pathname); // Debugging line

    return (
        <View style={styles.footerContainer}>
            {/* Home Button */}
            <TouchableOpacity
                onPress={() => {
                    if (pathname !== "/doctors/doctorHome") {
                        console.log('Navigating to /doctors/doctorHome'); // Debugging line
                        router.push("/doctors/doctorHome");
                    }
                }}
                style={styles.button}
                disabled={pathname === "/doctors/doctorHome"}
                accessibilityLabel="Home"
            >
                <MaterialIcons name="home" size={30} color={pathname === "/doctors/doctorHome" ? "black" : "white"} />
            </TouchableOpacity>

            {/* Chat Button */}
            <TouchableOpacity 
                onPress={() => {
                    if (pathname !== "/doctors/other/chatList") {
                        console.log('Navigating to /doctors/other/chatList'); // Debugging line
                        router.push("/doctors/other/chatList");
                    }
                }} 
                style={styles.button}
                accessibilityLabel="Chat"
            >
                <MaterialIcons name="chat" size={30} color={pathname === "/doctors/other/chatList" ? "black" : "white"} />
            </TouchableOpacity>

            {/* Settings Button */}
            <TouchableOpacity 
                onPress={() => {
                    if (pathname !== "/doctors/other/settingOptions") {
                        console.log('Navigating to /doctors/other/settingOptions'); // Debugging line
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
        backgroundColor: "#AF93D2",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: "black",
    },
    button: {
        paddingVertical: 8,
    },
});
