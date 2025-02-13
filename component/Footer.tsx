import { TouchableOpacity, View, StyleSheet } from "react-native";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { router, usePathname } from "expo-router";

export const Footer: React.FC = () => {
    const pathname = usePathname();

    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity
                onPress={() => pathname !== "/home" && router.push("/home")}
                style={styles.button}
                disabled={pathname === "/home"}
            >

                <MaterialIcons name="home" size={30} color={pathname === "/home" ? "black" : "white"} />
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={() => pathname!=="/user/userChat" && router.push("/user/userChat")} 
            style={styles.button}>
                <MaterialIcons name="chat" size={30} color={pathname=== "/user/userChat" ? "black":"white"} />
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={() => pathname!=="/user/userTask"&& router.push("/user/userTask")} 
            style={styles.button}>
                <MaterialIcons name="task" size={30} color={pathname==="/user/userTask"?"black": "white"} />
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
