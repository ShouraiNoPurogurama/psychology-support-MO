import { TouchableOpacity, View, StyleSheet } from "react-native";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { router, usePathname } from "expo-router";

export const Footer: React.FC = () => {
    const pathname = usePathname();

    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity
                onPress={() => pathname !== "/user/home" && router.push("/user/home")}
                style={styles.button}
                disabled={pathname === "/user/home"}
            >
                <MaterialIcons name="home" size={30} color={pathname === "/user/home" ? "black" : "white"} />
            </TouchableOpacity>
            {/* <TouchableOpacity  
                onPress={() => pathname!=="/user/userChat" && router.push("/user/userChatList")} 
                style={styles.button}
                disabled={pathname === "/user/userChatList"}
                >
                <MaterialIcons name="chat" size={30} color={pathname=== "/user/userChatList" ? "black":"white"} />
            </TouchableOpacity> */}
            <TouchableOpacity 
            onPress={() => pathname!=="/user/userTask"&& router.push("/user/userTask")} 
            style={styles.button}
            disabled={pathname === "/user/userTask"}
            >
                <MaterialIcons name="task" size={30} color={pathname==="/user/userTask"?"black": "white"} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
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
