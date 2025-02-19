import { TouchableOpacity, View, StyleSheet } from "react-native";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { router, usePathname } from "expo-router";

export const Footer: React.FC = () => {
    const pathname = usePathname();

    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity
                onPress={() => pathname !== "/doctor/doctorHome" && router.push("/doctor/doctorHome")}
                style={styles.button}
                disabled={pathname === "/doctor/doctorHome"}
            >

                <MaterialIcons name="home" size={30} color={pathname === "/doctor/doctorHome" ? "black" : "white"} />
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={() => pathname!=="/user/userChat" && router.push("/doctor/doctorChat")} 
            style={styles.button}>
                <MaterialIcons name="chat" size={30} color={pathname=== "/doctor/doctorChat" ? "black":"white"} />
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
